import React,{useEffect,useState,useRef} from 'react'
import styled from 'styled-components'
import {Column, Table, AutoSizer} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import Resolved from '../components/resolved'
import Status from '../components/status'
import {getListNotifications} from '../../utils/request'
const Container = styled.div`
  width:95%;
  height:100%;
`

const NameContainer = styled.div`
  display:flex;
  margin-top:25px;
  margin-bottom:35px;
`
const Name = styled.div`
  color:white;
  margin-right:15px;
  margin-left:10px;
`
const NameInput = styled.input`
  border:0px;
  outline:none;
  color:white;
  background:transparent;
  border-bottom:1px solid white;
`


const Main = () => {
  const [listNofications,setListNotifications] = useState([])
  const [name,setName] = useState(localStorage.getItem('name') ?? '')

  const refInput = useRef()
  const sortList = (list) => {
    list.sort((a,b)=>{
      if(a.pending == 0 && b.pending != 0)
        return 1
      else if(a.pending != 0 && b.pending == 0)
        return -1
      else if(new Date(a.date) > new Date(b.date))
        return -1
      else if(new Date(a.date) < new Date(b.date))
        return 1
      return a.anydesk > b.anydesk ? -1 : 1
    })
    setListNotifications(list)
  }
  useEffect(()=>{
    refInput.current.value = localStorage.getItem('name') ?? ''
    getListNotifications(sortList)
    const notifications = setInterval(()=>{
      getListNotifications(sortList)
    },30000)
    return () => clearInterval(notifications)
  },[])
  return (
    <Container>
    <NameContainer>
      <Name>Agent:</Name>
      <NameInput ref={refInput} onChange={(e) => {
        setName(e.target.value)
        localStorage.setItem('name',e.target.value)
      }}/>
    </NameContainer>
    <AutoSizer>
               {({ width}) => (
    <Table
      width={width}
      height={550}
      headerHeight={50}
      headerStyle={{color:"white"}}
      style={{outline:"none"}}
      rowHeight={40}
      sortBy=""
      rowCount={listNofications.length}
      rowGetter={({index}) => listNofications[index]}>
      <Column label="Anydesk ID" style={{color:"#cccccc"}} dataKey="anydesk" width={(width - 110)*0.33} />
      <Column label="Pending" style={{color:"#cccccc"}} width={(width - 110)*0.33} dataKey="pending" cellRenderer={({ cellData, rowIndex }) => <Status data={cellData.pending} />} cellDataGetter={({ rowData }) => rowData} />
      <Column label="Date" style={{color:"#cccccc"}} width={(width - 110)*0.33} dataKey="date" cellRenderer={({ cellData, rowIndex }) => new Date(cellData).toLocaleString()} />
      <Column label="Solved" style={{color:"#cccccc"}} width={110} cellRenderer={({ cellData, rowIndex }) => <Resolved data={cellData} name={name} />} cellDataGetter={({ rowData }) => rowData} />
    </Table>
  )}
          </AutoSizer>
    </Container>
  )
}
export default Main
