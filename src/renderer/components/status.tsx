import React,{useEffect,useState} from 'react'
import styled from 'styled-components'
import {NOTIFICATIONS} from '../../utils/constants'
const Container = styled.div`

`
const Resolved = ({data}) => {
  return (
    <Container>
      {NOTIFICATIONS[data]}
    </Container>
  )
}
export default Resolved
