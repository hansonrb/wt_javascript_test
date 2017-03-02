//@flow
import styled from 'styled-components'

export const Button = styled.div`
  position: relative;
  width: 100%;
  border: ${props => props.asLink ? 'none' : '3px solid #4CAF50'};
  border-radius: 8px;
  background-color: ${props => props.action ? '#4CAF50' : 'inherit'};
  color: ${props => props.action ? '#fff' : '#4CAF50'};
  font-size: ${props => props.fontSize}px;
  font-weight: ${props => props.fontWeight};
  line-height: 35px;
  text-transform: ${props => props.upCase ? 'uppercase' : 'none'};
  text-align: center;
  cursor: pointer;

  &:before {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
`
