import styled from 'styled-components';
import { shade } from 'polished';

export const TitleContainer = styled.div`
  margin-top: 200px;
  width: -webkit-fill-available;
  max-width: 700px;
  align-self: center;
  width: 100%;
  padding: 24px;
  text-decoration: none;

  align-items: center;

  text-align: center;
`;

export const BackButton = styled.div`
  display: flex;
  justify-content: initial;
  align-self: center;

  margin-bottom: 5px;

  /* margin-top: 180px; */

  width: 100%;
  max-width: 700px;

  a {
    text-decoration: none;
    display: flex;
    align-items: center;

    color: #3d3d4d;
    transition: color 0.2s;

    svg {
      margin-right: 5px;
    }

    &:hover {
      color: #666;
    }
  }
`;

export const RoomsContainer = styled.div`
  margin-top: 20px;
  width: -webkit-fill-available;
  max-width: 700px;
  align-self: center;

  background: #fff;
  border-radius: 5px;
  width: 100%;
  padding: 24px;
  text-decoration: none;

  align-items: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(10px);
  }

  & + & {
    margin-top: 16px;
  }

  position: relative;

  div {
    margin: 0 16px;
    /* flex: 1; */

    strong.nameRoom {
      display: block;
      width: 100%;

      margin-bottom: 10px;
      border-bottom: 1px solid #cbcbd6;

      text-align: center;
      font-size: 24px;
      color: #3d3d4d;
    }

    p {
      font-size: 18px;
      color: #a8a8b3;
      margin-top: 4px;

      strong {
        color: #3d3d4d;
        margin-right: 6px;
      }
    }

    p#empity {
      text-align: center;
    }

    div.buttonContainer {
      text-align: center;
      margin-top: 10px;
      border-top: 1px solid #cbcbd6;
      padding: 18px;
      padding-bottom: 0px;
      width: 100%;
      margin-left: 0px;

      button.editorButton {
        background: #465a6c;
        position: relative;

        color: #fff;

        padding: 5px;
        border-radius: 5px;
        top: 0;

        &:hover {
          background: ${shade(0.4, '#465a6c')};
        }
      }
    }
  }

  button {
    position: absolute;
    right: 16px;
    top: 19px;
    border: 0;
    background: transparent;
    color: #c53030;

    &:hover {
      color: ${shade(0.4, '#c53030')};
    }
  }
`;
