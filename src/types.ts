export type LogKind = 'info' | 'warning' | 'error' | 'expected-error';

export type LogEntry = {
    kind: LogKind;
    message?: string | undefined;
    data?: unknown;
    error?: unknown;
};

export type AppendLogParams = LogEntry;