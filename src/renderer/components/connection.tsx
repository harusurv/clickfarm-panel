import React,{useEffect,useState} from 'react'
import styled from 'styled-components'
import {isOnline} from '../../utils/utils'
const Container = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  width:100%;
  height:100%;
`
const Ball = styled.div`
  width:10px;
  height:10px;
  background:${props => props.online ? "#00FF00" : "#eeeeee55"};
  border-radius:10px;
`
const Resolved = ({data}) => {
  return (
    <Container>
      <Ball  online={isOnline(data)} />
    </Container>
  )
}
export default Resolved
