declare module 'aceternity-ui' {
  import React from 'react';

  interface TypewriterEffectProps {
    words: { text: string }[];
  }

  export const TypewriterEffect: React.FC<TypewriterEffectProps>;
}
