declare module 'aceternity-ui' {
  import * as React from 'react';

  export interface TypewriterEffectProps {
    text: { text: string }[];
    className?: string;
  }

  export const TypewriterEffect: React.FC<TypewriterEffectProps>;
}
