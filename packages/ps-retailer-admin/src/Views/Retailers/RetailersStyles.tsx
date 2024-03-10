import styled from '@emotion/styled';

export const RetailersComponentStyled = styled.div`
  padding-bottom: 1.5rem;
  position: relative;
`;

export const ModuleHeaderStyled = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;

  h1 {
    font-size: 1.5rem;
    margin: 0;
  }

  h2 {
    color: rgba(0, 0, 0, 0.38);
    font-size: 1rem;
    font-weight: normal;
    margin: 0.25rem 0 0 0;
  }
`;

export const HeaderActionsStyled = styled.div`
  > button {
    margin: 0 0.5rem;
  }
`;

export const ModuleBodyStyled = styled.div`
  padding: 0 1.5rem;
`;

export const BasicDetailsStyled = styled.div`
  border-radius: var(--borderRadius, 4px);
  background: var(--light-primary-shades-4-p, rgba(0, 71, 255, 0.04));
  justify-content: center;
  height: 144px;
  padding: 16px;
  width: 100%;
`;
