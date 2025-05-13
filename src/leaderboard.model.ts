export interface LeaderboardEntry {
    userId: string;
    username: string;
    points: number;
    lastUpdated: Date;
}

export interface Leaderboard {
    entries: LeaderboardEntry[];
    weekStartDate: Date;
    weekEndDate: Date;
} 