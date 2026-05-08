// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
type IpcReturn<Field extends PropertyKey = 'data', T = unknown> = {
  success: boolean;
  error?: string;
} & {
  [K in Field]?: T;
};
