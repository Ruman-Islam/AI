import styled from "styled-components";

export const TypewriterContainer = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  white-space: pre-wrap;
`;

const BoldText = styled.span`
  font-weight: 700;
`;

const BulletPoint = styled.div`
  padding-left: 20px;
  &::before {
    content: "• ";
  }
`;

export function formatText(text) {
  const regex = /(\*\*([^*]+)\*\*)|(\n)|(\u3010(\d+)\u([^u]+)\u)|(-\s[^\n]+)/g;
  const elements = [];
  let lastIndex = 0;

  text.replace(
    regex,
    (match, p1, boldText, newline, anchor, index, source, bullet, offset) => {
      if (offset > lastIndex) {
        elements.push(text.substring(lastIndex, offset));
      }
      if (boldText) {
        elements.push(<BoldText key={offset}>{boldText}</BoldText>);
      }
      if (newline) {
        elements.push(<br key={offset} />);
      }
      if (anchor) {
        elements.push(
          <a key={offset} href={`#source-${index}`}>
            {source}
          </a>
        );
      }
      if (bullet) {
        elements.push(
          <BulletPoint key={offset}>{bullet.substring(2)}</BulletPoint>
        );
      }
      lastIndex = offset + match.length;
    }
  );

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}
