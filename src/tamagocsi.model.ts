export interface Tamagocsi {
    id: number;
    name: string;
    level: number;
    hunger: number;
    thirst: number;
    energy: number;
    experience: number;
    experienceToNextLevel: number;
    lastFed: Date;
    lastWatered: Date;
    lastSlept: Date;
    isAlive: boolean;
} 