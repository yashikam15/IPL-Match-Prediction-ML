// backend/csvParser.ts

import fs from 'fs';
import path from 'path';
import { Team, Venue, Player, Match } from '../src/types';

const DATASETS_DIR = path.join(process.cwd(), 'backend', 'datasets');

function readCSVLines(filePath: string): string[] {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return [];
  }
}

export function parseTeams(): Team[] {
  const filePath = path.join(DATASETS_DIR, 'teams.csv');
  const lines = readCSVLines(filePath);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',');
  const list: Team[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 5) continue;
    list.push({
      team_id: parseInt(parts[0]),
      team_name: parts[1],
      short_name: parts[2],
      titles: parseInt(parts[3]),
      win_percentage: parseFloat(parts[4])
    });
  }
  return list;
}

export function parseVenues(): Venue[] {
  const filePath = path.join(DATASETS_DIR, 'venues.csv');
  const lines = readCSVLines(filePath);
  if (lines.length <= 1) return [];

  const list: Venue[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 6) continue;
    list.push({
      venue_id: parseInt(parts[0]),
      venue_name: parts[1],
      city: parts[2],
      avg_first_innings_score: parseFloat(parts[3]),
      toss_defendy_win_percent: parseFloat(parts[4]),
      toss_chasey_win_percent: parseFloat(parts[5])
    });
  }
  return list;
}

export function parsePlayers(): Player[] {
  const filePath = path.join(DATASETS_DIR, 'players.csv');
  const lines = readCSVLines(filePath);
  if (lines.length <= 1) return [];

  const list: Player[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 7) continue;
    list.push({
      player_id: parseInt(parts[0]),
      player_name: parts[1],
      team: parts[2],
      role: parts[3],
      batting_sr: parts[4] === '-' || parts[4] === 'null' ? null : parseFloat(parts[4]),
      bowling_eco: parts[5] === '-' || parts[5] === 'null' ? null : parseFloat(parts[5]),
      captain_win_percent: parts[6] === '-' || parts[6] === 'null' ? null : parseFloat(parts[6])
    });
  }
  return list;
}

export function parseMatches(): Match[] {
  const filePath = path.join(DATASETS_DIR, 'matches.csv');
  const lines = readCSVLines(filePath);
  if (lines.length <= 1) return [];

  // Parse CSV handles commas correctly inside quotes
  const list: Match[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Simple state-machine CSV parser to handle quotes
    const parts: string[] = [];
    let currentPart = '';
    let inQuotes = false;
    
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(currentPart);
        currentPart = '';
      } else {
        currentPart += char;
      }
    }
    parts.push(currentPart);

    if (parts.length < 15) continue;

    list.push({
      id: parseInt(parts[0]),
      season: parseInt(parts[1]),
      city: parts[2],
      date: parts[3],
      team1: parts[4],
      team2: parts[5],
      toss_winner: parts[6],
      toss_decision: parts[7],
      result: parts[8],
      dl_applied: parseInt(parts[9]),
      winner: parts[10],
      win_by_runs: parseInt(parts[11]),
      win_by_wickets: parseInt(parts[12]),
      player_of_match: parts[13],
      venue: parts[14]
    });
  }
  return list;
}
