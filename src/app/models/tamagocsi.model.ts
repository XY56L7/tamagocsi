export interface Tamagocsi {
    id: number;
    name: string;
    level: number;
    hunger: number;
    thirst: number;
    experience: number;
    experienceToNextLevel: number;
    lastFed: Date;
    lastWatered: Date;
    isAlive: boolean;
} 