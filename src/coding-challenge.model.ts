export type CodingLanguage = 'python' | 'javascript' | 'java' | 'cpp' | 'csharp';

export interface CodingChallenge {
    id: number;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    language: CodingLanguage;
    code: string;
    testCases: {
        input: string;
        expectedOutput: string;
    }[];
    experienceReward: number;
    solution: string;
} 