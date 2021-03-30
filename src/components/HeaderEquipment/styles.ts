import styled from 'styled-components';
import { shade } from 'polished';
import { Link } from 'react-router-dom';

// interface FormProps {
//   hasError: boolean;
// }

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

export const FormContainer = styled.div`
  display: flex;
  flex: 1;
  width: 600px;
  max-width: 700px;

  margin-left: 10px;
  form {
    max-width: 700px;

    display: flex;
    flex: 1;
  }

  /* .ifVJGm {
    border-radius: 5px 0 0 5px;
  } */

  /* input {
    flex: 1;
    height: 70px;
    padding: 0 24px;
    border: 0;
    border-radius: 5px 0 0 5px;
    color: #3a3a3a;
    border: 2px solid #fff;
    border-right: 0px;
  } */

  button {
    width: 100px;
    height: 70px;
    background: #465a6c;
    border-radius: 0 5px 5px 0;
    border: 0;
    color: #fff;
    font-weight: bold;
    transition: background-color 0.2s;
    margin-right: 10px;

    &:hover {
      background: ${shade(0.2, '#465a6c')};
    }
  }
`;

export const Container = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 20px 0;

  background: #d2d2d2;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;

  h1 {
    margin-left: 10px;
    font-size: 20px;
    color: #465a6c;
    max-width: 150px;
    margin-right: auto;
    align-self: center;
  }
`;

export const LogoutContainer = styled.div`
  display: flex;
  justify-content: center;

  color: #c53030;

  transition: color 0.2s;
  &:hover {
    color: ${shade(-0.2, '#c53030')};
  }

  p {
    align-self: center;
  }
`;

export const RoomsContainer = styled.div`
  margin-top: 80px;
  // margin-bottom: -180px;
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

  a {
    text-decoration: none;
  }

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

        margin-left: 10px;
        margin-right: 10px;

        transition: background 0.2s;
        &:hover {
          background: ${shade(0.4, '#465a6c')};
        }
      }
    }
  }

  button#remove {
    position: absolute;
    right: 16px;
    top: 19px;
    border: 0;
    background: transparent;
    color: #c53030;
    display: flex;
    align-items: center;

    transition: color 0.2s;
    &:hover {
      color: ${shade(0.4, '#c53030')};
    }
  }
`;

// export const Form = styled.form<FormProps>`
//   max-width: 700px;

//   display: flex;
//   flex: 1;

//   input {
//     flex: 1;
//     height: 70px;
//     padding: 0 24px;
//     border: 0;
//     border-radius: 5px 0 0 5px;
//     color: #3a3a3a;
//     border: 2px solid #fff;
//     border-right: 0px;

//     ${(props) =>
//       props.hasError &&
//       css`
//         border-color: #c53030;
//       `}

//     &::placeholder {
//       color: #a8a8b3;
//     }
//   }

//   button {
//     width: 100px;
//     height: 70px;
//     background: #465a6c;
//     border-radius: 0px 5px 5px 0px;
//     border: 0;
//     color: #fff;
//     font-weight: bold;
//     transition: background-color 0.2s;
//     margin-right: 10px;

//     &:hover {
//       background: ${shade(0.2, '#465a6c')};
//     }
//   }
// `;

// export const Error = styled.span`
//   display: block;
//   color: #c53030;
//   margin-top: 8px;
// `;
