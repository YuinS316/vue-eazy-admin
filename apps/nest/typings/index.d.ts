//  jwt签名后的载体
export interface JWTPayload {
  id: number;
  userName: string;
}

declare global {
  interface Global {}

  interface Headers {
    authorization?: string;
    Authorization?: string;
  }
}

export default {};
