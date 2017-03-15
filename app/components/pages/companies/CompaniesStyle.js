//@flow
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 100px;
`
export const Header = styled.div`
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 30px;
`
export const Company = styled.div`
  background-color: #ddd;
  padding: 20px;
  font-size: 20px;
  margin: 10px;
`
export const Toolbar = styled.div`
  background-color: #ffffff;
  padding: 20px;
  font-size: 20px;
  margin: 10px;
`

export const Button = styled.button`
  border: 2px solid #337ab7;
  border-radius: 5px;
  padding: 5px 20px;
  font-size: 20px;
  text-decoration: none;
  outline: none;
  background-color: #fafafa;
`

export const Input = styled.input`
  padding: 5px 20px;
  border: 2px solid #337ab7;
  border-radius: 5px;
  font-size: 20px;
`

export const ErrorMessage = styled.div`
  font-size: 20px;
  color: #ff0000;
`
