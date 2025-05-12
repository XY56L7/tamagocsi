export interface CodingChallenge {
    id: number;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    language: 'python';
    code: string;
    testCases: {
        input: string;
        expectedOutput: string;
    }[];
    experienceReward: number;
    solution: string;
} 