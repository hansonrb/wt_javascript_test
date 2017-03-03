//@flow
import styled from 'styled-components'

export const ToolTipBox = styled.div`
  position: absolute;
  top: 90%;
  width: ${props => props.width};
  min-height: 50px;
  padding-bottom: 30px;
  background: #fff;
  border: 1px solid #e2e2e2;
  text-align: center;
  font-size: 14px;
  white-space: pre-line;

  &:before, &:after {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  &:after {
    border-color: rgba(255, 255, 255, 0);
    border-bottom-color: #fff;
    border-width: 10px;
    margin-left: -10px;
  }

  &:before {
    border-color: rgba(170, 170, 170, 0);
    border-bottom-color: #e2e2e2;
    border-width: 11px;
    margin-left: -11px;
  }
`
