'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCourseNextStep } from '@/lib/courses/next-steps';
import { makeCertificateId } from '@/lib/courses/types';

export type AnswerRecord = { choiceId: string; correct: boolean };

export type CourseSave = {
  guideId: string;
  language: string;
  completedCheckpoints: string[];
  answers: Record<string, AnswerRecord>;
  firstAttempt: { correct: number; total: number; xp: number } | null;
  completed: boolean;
  xpAwarded: number;
  simCorrect?: number;
  simTotal?: number;
};

export type GameSave = {
  completed: boolean;
  score: number;
  maxScore: number;
  xpAwarded: number;
  summary: string;
};

export type CertificateRecord = {
  courseId: string;
  courseTitle: string;
  learnerName: string;
  issuedAt: string;
  score: number;
  total: number;
  certificateId: string;
  about: string;
  howToProceed: string[];
  nextTitle: string;
  nextHref: string;
  nextDetail: string;
};

type PlatformState = {
  name: string;
  guardianAck: boolean;
  xp: number;
  awarded: Record<string, number>;
  courses: Record<string, CourseSave>;
  games: Record<string, GameSave>;
  certificates: Record<string, CertificateRecord>;
  setName: (name: string) => void;
  setGuardianAck: (value: boolean) => void;
  setGuide: (courseId: string, guideId: string, language: string) => void;
  recordCheckpoint: (courseId: string, checkpointId: string, answer: AnswerRecord) => void;
  completeCourse: (courseId: string, correct: number, total: number, xp: number) => void;
  issueCertificate: (input: {
    courseId: string;
    courseTitle: string;
    score: number;
    total: number;
  }) => CertificateRecord | null;
  resetCourseRun: (courseId: string) => void;
  completeGame: (gameId: string, score: number, maxScore: number, xp: number, summary: string) => void;
};

const emptyCourse = (guideId = 'mira', language = 'en'): CourseSave => ({
  guideId,
  language,
  completedCheckpoints: [],
  answers: {},
  firstAttempt: null,
  completed: false,
  xpAwarded: 0,
});

export const usePlatform = create<PlatformState>()(
  persist(
    (set, get) => ({
      name: 'Learner',
      guardianAck: false,
      xp: 0,
      awarded: {},
      courses: {},
      games: {},
      certificates: {},
      setName: (name) => set({ name: name.slice(0, 32) || 'Learner' }),
      setGuardianAck: (value) => set({ guardianAck: value }),
      setGuide: (courseId, guideId, language) =>
        set((state) => {
          const current = state.courses[courseId] ?? emptyCourse();
          return { courses: { ...state.courses, [courseId]: { ...current, guideId, language } } };
        }),
      recordCheckpoint: (courseId, checkpointId, answer) =>
        set((state) => {
          const current = state.courses[courseId] ?? emptyCourse();
          const completed = current.completedCheckpoints.includes(checkpointId)
            ? current.completedCheckpoints
            : [...current.completedCheckpoints, checkpointId];
          return {
            courses: {
              ...state.courses,
              [courseId]: {
                ...current,
                completedCheckpoints: completed,
                answers: { ...current.answers, [checkpointId]: answer },
              },
            },
          };
        }),
      completeCourse: (courseId, correct, total, xp) =>
        set((state) => {
          const current = state.courses[courseId] ?? emptyCourse();
          const already = state.awarded[`course:${courseId}`] ?? 0;
          const grant = already > 0 ? 0 : xp;
          const firstAttempt = current.firstAttempt ?? { correct, total, xp: grant };
          return {
            xp: state.xp + grant,
            awarded: { ...state.awarded, [`course:${courseId}`]: already || grant },
            courses: {
              ...state.courses,
              [courseId]: { ...current, completed: true, firstAttempt, xpAwarded: already || grant },
            },
          };
        }),
      issueCertificate: ({ courseId, courseTitle, score, total }) => {
        const existing = get().certificates[courseId];
        if (existing) return existing;
        const next = getCourseNextStep(courseId);
        const record: CertificateRecord = {
          courseId,
          courseTitle,
          learnerName: get().name || 'Learner',
          issuedAt: new Date().toISOString(),
          score,
          total,
          certificateId: makeCertificateId(),
          about: next.about,
          howToProceed: next.howToProceed,
          nextTitle: next.nextTitle,
          nextHref: next.nextHref,
          nextDetail: next.nextDetail,
        };
        set((state) => ({ certificates: { ...state.certificates, [courseId]: record } }));
        return record;
      },
      resetCourseRun: (courseId) =>
        set((state) => {
          const current = state.courses[courseId] ?? emptyCourse();
          return {
            courses: {
              ...state.courses,
              [courseId]: {
                ...current,
                completedCheckpoints: [],
                answers: {},
                completed: current.firstAttempt ? true : false,
              },
            },
          };
        }),
      completeGame: (gameId, score, maxScore, xp, summary) =>
        set((state) => {
          const key = `game:${gameId}`;
          const already = state.awarded[key] ?? 0;
          const previous = state.games[gameId];
          const better = !previous || score > previous.score;
          const grant = already > 0 ? 0 : xp;
          return {
            xp: state.xp + grant,
            awarded: { ...state.awarded, [key]: already || grant },
            games: {
              ...state.games,
              [gameId]: {
                completed: true,
                score: better ? score : previous.score,
                maxScore,
                xpAwarded: already || grant,
                summary: better ? summary : previous.summary,
              },
            },
          };
        }),
    }),
    { name: 'saferon-platform-v1' },
  ),
);
