import React,{useEffect,useState} from 'react'
import styled from 'styled-components'
import {solveNotification} from '../../utils/request'
const Container = styled.div`

`
const Button = styled.div`
  cursor:pointer;
  background:transparent;
  color:white;
  text-align:center;
  padding:5px;
  width:70px;
  border:1px solid white;
  border-radius:5px;
  transition:0.3s;
  opacity:${(props)=>props.disabled ? 0.5 : 1};
  pointer-events:${(props)=>props.disabled ? "none" : "all"};

  &:hover{
    opacity:0.8;
  }

`
const Resolved = ({data,name,updateNot,on_rutine}) => {
  const [loading,setLoading] = useState(false)
  return (
    <Container>
      <Button disabled={loading || data.pending == 0 || on_rutine} onClick={()=>{
        setLoading(true)
        solveNotification(data.anydesk,name,(rt)=>{
          data.pending = rt ? 0 : data.pending
          updateNot()
          setLoading(false)
        })
      }}>{on_rutine ? "On rutine" : data.pending == 0 ? "Ok" : loading ? "Checking" : "Solve"}</Button>
    </Container>
  )
}
export default Resolved
