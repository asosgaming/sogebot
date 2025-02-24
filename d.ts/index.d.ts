type ChatUser = import('@twurple/chat').ChatUser;

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

type UserStateTags = import('twitch-js').UserStateTags;
type KnownNoticeMessageIds = import('twitch-js').KnownNoticeMessageIds;

type DiscordJsTextChannel = import('discord.js').TextChannel;
type DiscordJsUser = import('discord.js').User;

declare class Stringified<T> extends String {
  private ___stringified: T;
}

interface JSON {
  stringify<T>(value: T, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string & Stringified<T>;
  parse<T>(text: Stringified<T>, reviver?: (key: any, value: any) => any): T
  parse(text: string, reviver?: (key: any, value: any) => any): any
}

type TimestampObject = {
  hours: number; minutes: number; seconds: number
};

type UserStateTagsWithId = UserStateTags & { userId: string };

interface Command {
  id: string;
  name: string;
  command?: string;
  fnc?: string;
  isHelper?: boolean;
  permission?: string | null;
  dependsOn?: import('../src/bot/_interface').Module[];
}

interface Parser {
  name: string;
  fnc?: string;
  permission?: string;
  priority?: number;
  fireAndForget?: boolean;
  skippable?: boolean;
  dependsOn?: import('../src/bot/_interface').Module[];
}

type onEventSub = {
  userName: string;
  userId: string;
  subCumulativeMonths: number;
};

type onEventFollow = {
  userName: string;
  userId: string;
};

type onEventTip = {
  userName: string;
  amount: number;
  message: string;
  currency: currency;
  timestamp: number;
};

type onEventBit = {
  userName: string;
  amount: number;
  message: string;
  timestamp: number;
};

type onEventMessage = {
  sender: Partial<UserStateTags> | null;
  message: string;
  timestamp: number;
};

declare namespace InterfaceSettings {
  interface Settings<C> {
    commands?: C;
    parsers?: Parser[];
    [s: string]: any;
  }

  interface On {
    startup?: string[];
    message?: (message: onEventMessage) => void;
    sub?: (sub: onEventSub) => void;
    follow?: (follow: onEventFollow) => void;
    tip?: (tip: onEventTip) => void;
    bit?: (bit: onEventBit) => void;
    streamStart?: () => void;
    streamEnd?: () => void;
    change?: {
      [x: string]: string[];
    };
    load?: {
      [x: string]: string[];
    };
    partChannel?: () => void;
    joinChannel?: () => void;
  }

  interface UI {
    [x: string]: {
      [s: string]: UISelector | UILink | UINumberInput | UIConfigurableList | UISortableList | UITextInput | UIHighlightsUrlGenerator;
    } | boolean | UISelector | UILink | UINumberInput | UIConfigurableList | UISortableList | UITextInput | UIHighlightsUrlGenerator;
  }
}

interface InterfaceSettings {
  settings?: InterfaceSettings.Settings<(Command | string)[]>;
  on?: InterfaceSettings.On;
  ui?: InterfaceSettings.UI;
  dependsOn?: string[];
}

interface UISelector {
  type: 'selector';
  values: string[] | (() => string[]);
  if?: () => boolean;
}

interface UIConfigurableList {
  type: 'configurable-list';
  if?: () => boolean;
}

interface UILink {
  type: 'link';
  href: string;
  class: string;
  rawText: string;
  target: string;
  if?: () => boolean;
}

interface UITextInput {
  type: 'text-input';
  secret: boolean;
  if?: () => boolean;
}

interface UINumberInput {
  type: 'number-input';
  step?: number;
  min?: number;
  max?: number;
  if?: () => boolean;
}

interface UISortableList {
  type: 'sortable-list';
  values: string;
  toggle: string;
  toggleOnIcon: string;
  toggleOffIcon: string;
  if?: () => boolean;
}

interface UIHighlightsUrlGenerator {
  type: 'highlights-url-generator';
  if?: () => boolean;
}

type CommandResponse = import('./src/parser').CommandResponse;
type CommandOptions = import('./src/parser').CommandOptions;
interface ParserOptions {
  id: string;
  sender: Omit<ChatUser, '_userName' | '_userData' | '_parseBadgesLike'> | null;
  emotesOffsets: Map<string, string[]>
  discord: { author: DiscordJsUser; channel: DiscordJsTextChannel } | undefined
  isAction: boolean,
  isFirstTimeMessage: boolean,
  parameters: string;
  message: string;
  skip: boolean;
  isParserOptions: boolean;
  forbidReply?: boolean;
  parser?: import('../src/parser.js').default;
}

interface Vote {
  _id?: any;
  vid: string;
  votedBy: string;
  votes: number;
  option: number;
}

interface Poll {
  _id?: any;
  id: string;
  type: 'tips' | 'bits' | 'normal';
  title: string;
  isOpened: boolean;
  options: string[];
  openedAt: number;
  closedAt?: number;
}