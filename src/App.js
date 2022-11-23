import React, { useState, useRef, useEffect } from 'react' ;
import {firestore} from "./firebase";
import { doc, setDoc, getDocs, collection} from "@firebase/firestore"
import ItemList from './ItemList';
//import { async } from '@firebase/util';

function App() {
  
//YO
  
  const [items, SetItems] = useState([])
  const collectionRef = collection(firestore, "Items")
  const ItemNameRef = useRef()
  const ItemNumRef = useRef()

  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const check = async () => {
    while (true) {
      await sleep(3500)
      const data1 = await getDocs(collectionRef);
      try{
        const DOCdata1 = data1.docs.map((doc) => ({...doc.data()}))
        SetItems(DOCdata1[0].myList)
      } catch (e) {
        window.location.reload();
      }
      
    }
  }
  
  //const LOCAL_STORAGE_KEY = "app.items"

  useEffect( () => {
    
    const getItems = async () => {
      check()
      console.log("start")
      const data = await getDocs(collectionRef);
      
      const DOCdata = data.docs.map((doc) => ({...doc.data()}))
      if(DOCdata[0].myList.length !== 0)
      {
        SetItems(DOCdata[0].myList)
        console.log("finish")
      }
      
      
    }
    try {
      getItems()
    } catch (e) {
      window.location.reload();
    }
    
    //const storedItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    //SetItems(storedItems) if storedItems is not empty
  }, [])

  
  useEffect( () => {
    async function saveData() {
      let data = {
        myList: items };
      await setDoc(doc(firestore, "Items", "Item List"), data)
    }
    if (items.length !== 0)
    {
      try{
        saveData()
      } catch (e) {
        window.location.reload();
      }
      
      //console.log("Save", JSON.stringify(items))
      //localStorage.setItem(LOCAL_STORAGE_KEY , JSON.stringify(items))
    }
    

  }, [items])

  function Delete_Item(id) {
    const NewItems = items.filter(item => item.id !== id);
    for (let i = 0; i < NewItems.length; i++) NewItems[i].id = i
    SetItems(NewItems)
  }

  function Edit_Item(id) {
    const NewItems = [...items]
    const item = NewItems.find(item => item.id === id)

    if(ItemNameRef.current.value) item.name = ItemNameRef.current.value
    if(ItemNumRef.current.value) item.number = ItemNumRef.current.value;
    ItemNameRef.current.value = null
    ItemNumRef.current.value = null
    item.id = id
    SetItems(NewItems)
  }

  function Add_Item(e) {
    const name = ItemNameRef.current.value
    const num = ItemNumRef.current.value
    const len = items.length
    if(name === '' || num === '') return
    SetItems( prevItem => {
      return [...prevItem,{id:len, name: name,number: num}]
    })
    ItemNameRef.current.value = null
    ItemNumRef.current.value = null
  }

  
  return (
    <>
      <h1>רשימת קניות</h1>
      <ItemList items={items} Edit_Item={Edit_Item} Delete_Item={Delete_Item} /> פריט:
      <input ref={ItemNameRef} type="testbox" /> <br/> כמות:
      <input ref={ItemNumRef} type="testbox" />
      <br/>
      <input value="הוסף פריט לרשימה" onClick={Add_Item} type="button" /> 
    </>
    
  )

}

export default App;
