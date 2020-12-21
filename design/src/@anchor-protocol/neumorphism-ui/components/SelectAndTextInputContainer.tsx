import {
  pressed,
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import styled from 'styled-components';

export const SelectAndTextInputContainer = styled.div`
  border-radius: 5px;

  ${({ theme }) =>
    pressed({
      color: theme.textInput.backgroundColor,
      backgroundColor: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity * 2,
    })};

  height: 60px;
  padding: 2px 20px;

  display: flex;

  .MuiInputBase-root {
    color: ${({ theme }) => theme.textInput.textColor};
  }
  
  .MuiNativeSelect-icon {
    color: currentColor;
  }

  > :not(:last-child) {
    padding-right: 20px;
    border-right: 1px solid
      ${({ theme }) =>
        rulerShadowColor({
          color: theme.textInput.backgroundColor,
          intensity: theme.intensity,
        })};
  }

  > :not(:first-child) {
    padding-left: 20px;
    border-left: 1px solid
      ${({ theme }) =>
        rulerLightColor({
          color: theme.textInput.backgroundColor,
          intensity: theme.intensity,
        })};
  }

  .MuiInput-underline:before,
  .MuiInput-underline:after {
    display: none;
  }
`;
