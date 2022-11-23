import React, { useState, useRef, useEffect } from 'react' ;
import {firestore} from "./firebase";
import { doc, setDoc, getDocs, collection} from "@firebase/firestore"
import ItemList from './ItemList';

function App() {
  
  //משתנים
  const [items, SetItems] = useState([])
  const collectionRef = collection(firestore, "Items")
  const ItemNameRef = useRef()
  const ItemNumRef = useRef()


  //פונקציות 
  const sleep = ms => new Promise( resolve => setTimeout(resolve, ms) ); //sleep func


  const check = async () => { // לעדכן את הרשימה לפי הפייר-בייס כל כמה שניות
    while (true) {
      await sleep(3500)
      const dataForC = await getDocs(collectionRef); //ליבא את האוסף איטם
      try{
        const DOCdataR = dataForC.docs.map((doc) => ({...doc.data()})) //והוציא מהאוסף את הדוקומנטים
        SetItems(DOCdataR[0].myList) // לעדכן את הרשימה
      } catch (e) {
        window.location.reload(); // אם לא עבד לבצע רינון של הדף.
      }  // כדי שהפעולה לא תיתבצע בשגיאה, או כאשר אין אינטרט שידעו את זה
    }
  }


  useEffect( () => { // מופעל פעם אחת כשהאפליקציה מופעלת לראשונה
                     // ומיבא מהפייר-בייס את הנתונים
    const getItems = async () => {
      check()
      console.log("start")
      const data = await getDocs(collectionRef);
      // אותו רעיון כמו לעדכן (לוקחים את האוסף וקוראים מסמך ספציפי)
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
      window.location.reload(); // אותו רעיון
    }

  }, [])

  
  useEffect( () => { //כשיש פעולה על הרשימה רוצים לעדכן את זה הפייר-בייס
    async function saveData() {
      let data = {
        myList: items 
      }; // <-מה ששומרים
      await setDoc(doc(firestore, "Items", "Item List"), data)  // פעולת השמירה
    }
    if (items.length !== 0)
    {
      try{
        saveData()
      } catch (e) {
        window.location.reload(); // אותו רעיון
      }
    }
  }, [items])

  function Delete_Item(id) { // מחיקת איבר מהרשימה
    const NewItems = items.filter(item => item.id !== id);
    for (let i = 0; i < NewItems.length; i++) NewItems[i].id = i
    SetItems(NewItems)
  }

  function Edit_Item(id) {  // עריככת איבר
    const NewItems = [...items] // יצירת רשימה  מועתקת
    const item = NewItems.find(item => item.id === id) // מציאת האיבר שאנחנו רוצים לשנות

    if(ItemNameRef.current.value) item.name = ItemNameRef.current.value; // עריכת שם המוצר
    if(ItemNumRef.current.value) item.number = ItemNumRef.current.value; // עריכת כמות המוצר
    ItemNameRef.current.value = null 
    ItemNumRef.current.value = null // לרוקן את השדה של המספר והשם
    item.id = id // שמירת האי-די
    SetItems(NewItems)
  }

  function Add_Item(e) { // add a item for the list
    const name = ItemNameRef.current.value // get the name
    const num = ItemNumRef.current.value // get the amount of the item
    const len = items.length // get th ID
    if(name === '' || num === '') return // if there no value, we can't need to add item
    SetItems( prevItem => {
      return [...prevItem,{id:len, name: name,number: num}] // Add the item!
    })
    ItemNameRef.current.value = null 
    ItemNumRef.current.value = null //set the textboxs to null
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