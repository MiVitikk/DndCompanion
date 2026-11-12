export type Spell = {
  index: string;
  name: string;
  level: number;
  url: string;
}

export type SpellDetails = {
  name: string;
  level: number;
  school: {
    name: string;
  };
  desc: string[];
  higher_level: string[];
  components: string[];
  range: string;
  duration: string;
  casting_time: string;
  concentration?: boolean;
  ritual?: boolean;
  material?: string;
}