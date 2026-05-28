export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface RocketConfig {
  booster: "srb" | "liquid" | "hybrid";
  payload: "orion" | "webb" | "rover";
  sensors: string[];
  fuelRatio: number; // 0 to 100 (Optimal is around 50-65)
}

export type LaunchStatus = "idle" | "countdown" | "ascending" | "separation" | "insertion" | "success" | "failed";

export interface POI {
  id: string;
  name: string;
  x: number;
  y: number;
  discovered: boolean;
  description: string;
  fact: string;
  item: string;
}

export interface RoverCommand {
  type: "move" | "laser" | "scoop" | "camera" | "drill";
  param?: string; // e.g. "x,y" or sensor name
  status: "pending" | "running" | "done";
}

export interface TrainingLevel {
  id: "docking" | "stars" | "lifesupport";
  name: string;
  completed: boolean;
  score: number;
}
