import React,{useEffect,useState,useRef} from 'react'
import styled from 'styled-components'
import {Column, Table, AutoSizer} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import Resolved from '../components/resolved'
import Status from '../components/status'
import {getListNotifications,getResueltos} from '../../utils/request'
import {connectAnydesk} from '../../utils/anydesk'
import {isOnline} from '../../utils/utils'
import {initializeWebsocket} from '../../utils/websocket'

import Connection from '../components/connection'
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
const StyledTable = styled(Table)`
    outline:none;
    .ReactVirtualized__Table__row {
        transition:0.2s background;
        cursor:pointer;
        :hover {
            background: #ffffff22;
        }
    }
`;
const Stats = styled.div`
  width:100%;
  justify-content:end;
  display:flex;
`

const Main = () => {
  const [listNofications,setListNotifications] = useState([])
  const [name,setName] = useState(localStorage.getItem('name') ?? '')
  const [resueltos,setResueltos] = useState("-")
  const [nameUpdate,setNameUpdate] = useState(new Date().getTime())
  const refTimeout = useRef()
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
    setNameUpdate(new Date().getTime())
  }
  useEffect(()=>{
    initializeWebsocket((anydesk,value)=>{
      const list = listNofications
      for(let d of list)
        if(d.anydesk == anydesk)
          d.on_rutine = value
      sortList(list)
    },
    (anydesk,value)=>{
      const list = listNofications
      for(let d of list)
        if(d.anydesk == anydesk)
          d.pending = value
      sortList(list)
    })
  },[listNofications])
  useEffect(()=>{
    refInput.current.value = localStorage.getItem('name') ?? ''
    getListNotifications(sortList)
    const notifications = setInterval(()=>{
      getListNotifications(sortList)
    },30000)
    return () => clearInterval(notifications)
  },[])
  useEffect(()=>{
    if(name && name.length > 0)
      getResueltos(name,setResueltos)
    clearInterval(refTimeout.current)
    refTimeout.current = setInterval(()=>{
      if(name && name.length > 0)
        getResueltos(name,setResueltos)
    },30000)
  },[name])

  return (
    <Container>
    <NameContainer>
      <Name>Agent:</Name>
      <NameInput ref={refInput} onChange={(e) => {
        setName(e.target.value)
        localStorage.setItem('name',e.target.value)
      }}/>
      <Stats>
      <Name>Online: {listNofications.filter(a => isOnline(a.last_connection)).length}/{listNofications.length}</Name>
      <Name>Resueltos: {resueltos}</Name>
      </Stats>
    </NameContainer>
    <AutoSizer>
               {({ width}) => (
    <StyledTable
      width={width}
      height={550}
       key={Math.random()}
      headerHeight={50}
      headerStyle={{color:"white"}}
      style={{outline:"none"}}
      rowHeight={40}
      onRowDoubleClick={({rowData})=>{
        if(rowData.on_rutine == 0)
          connectAnydesk(rowData.anydesk,rowData.password)
      }}
      sortBy=""
      rowCount={listNofications.length}
      rowGetter={({index}) => listNofications[index]}>
      <Column style={{color:"#cccccc"}} dataKey="last_connection" width={20} cellRenderer={({ cellData, rowIndex }) => <Connection data={cellData.last_connection} on_rutine={cellData.on_rutine == 1} />} cellDataGetter={({ rowData }) => rowData} />
      <Column label="Anydesk" style={{color:"#cccccc"}} dataKey="anydesk" width={100} />
      <Column label="Email" style={{color:"#cccccc"}} dataKey="email" width={(width - 570)} />
      <Column label="Pending" style={{color:"#cccccc"}} width={120} dataKey="pending" cellRenderer={({ cellData, rowIndex }) => <Status data={cellData.pending} />} cellDataGetter={({ rowData }) => rowData} />
      <Column label="Date" style={{color:"#cccccc"}} width={220} dataKey="date" cellRenderer={({ cellData, rowIndex }) => new Date(cellData).toLocaleString()} />
      <Column label="Solved" style={{color:"#cccccc"}} width={110} cellRenderer={({ cellData, rowIndex }) => <Resolved updateNot={()=>getListNotifications(sortList)} on_rutine={cellData.on_rutine == 1} data={cellData} name={name} />} cellDataGetter={({ rowData }) => rowData} />
    </StyledTable>
  )}
          </AutoSizer>
          <div style={{display:"none"}}>{nameUpdate}</div>
    </Container>
  )
}
export default Main
