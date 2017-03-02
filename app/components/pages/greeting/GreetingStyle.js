//@flow
import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  margin-top: 5%;
  width: 100%;
  height: inherit;
`

export const SubContainer = styled.div`
  position: relative;
  width: ${props => props.width || '50%'};
  height: ${props => props.height};
  min-height: ${props => props.minHeight || '50px'};
  display: inline-flex;
  padding: ${props => props.padding || '0 0 0 0'};
`
