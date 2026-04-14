import { describe, it, expect } from "vitest";
import {
  FIXED_TRACKS,
  TRACKS_BY_ID,
  generateDailyTrack,
  getAllTracksForDate,
} from "../tracks";
import { RaceDifficulty } from "../types";

describe("FIXED_TRACKS", () => {
  it("ships the five named v1 tracks", () => {
    const names = FIXED_TRACKS.map((t) => t.name);
    expect(names).toEqual([
      "Asteroid Alley",
      "Nebula Sprint",
      "Orbital Run",
      "Void Corridor",
      "Solar Slingshot",
    ]);
  });

  it("every track has 10–15 checkpoints (Part 7 spec)", () => {
    for (const t of FIXED_TRACKS) {
      expect(t.checkpoints.length).toBeGreaterThanOrEqual(10);
      expect(t.checkpoints.length).toBeLessThanOrEqual(15);
    }
  });

  it("every track has a unique id and a valid difficulty", () => {
    const ids = FIXED_TRACKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of FIXED_TRACKS) {
      expect(Object.values(RaceDifficulty)).toContain(t.difficulty);
      expect(t.isDaily).toBe(false);
      expect(t.checkpointRadius).toBeGreaterThan(0);
    }
  });

  it("TRACKS_BY_ID indexes every fixed track", () => {
    expect(Object.keys(TRACKS_BY_ID)).toHaveLength(FIXED_TRACKS.length);
  });
});

describe("generateDailyTrack", () => {
  it("is deterministic for the same UTC date", () => {
    const d1 = new Date("2026-04-15T00:30:00.000Z");
    const d2 = new Date("2026-04-15T23:45:00.000Z");
    const t1 = generateDailyTrack(d1);
    const t2 = generateDailyTrack(d2);
    expect(t1.id).toBe(t2.id);
    expect(t1.checkpoints).toEqual(t2.checkpoints);
  });

  it("varies across different days", () => {
    const a = generateDailyTrack(new Date("2026-04-15T12:00:00.000Z"));
    const b = generateDailyTrack(new Date("2026-04-16T12:00:00.000Z"));
    expect(a.id).not.toBe(b.id);
    expect(a.checkpoints).not.toEqual(b.checkpoints);
  });

  it("honors the 10–15 checkpoint rule", () => {
    const track = generateDailyTrack(new Date("2026-04-15T00:00:00.000Z"));
    expect(track.checkpoints.length).toBeGreaterThanOrEqual(10);
    expect(track.checkpoints.length).toBeLessThanOrEqual(15);
  });

  it("flags isDaily=true", () => {
    expect(generateDailyTrack(new Date()).isDaily).toBe(true);
  });
});

describe("getAllTracksForDate", () => {
  it("returns 5 fixed + 1 daily = 6 tracks", () => {
    const tracks = getAllTracksForDate(new Date("2026-04-15T12:00:00.000Z"));
    expect(tracks).toHaveLength(6);
    expect(tracks.filter((t) => t.isDaily)).toHaveLength(1);
  });
});
