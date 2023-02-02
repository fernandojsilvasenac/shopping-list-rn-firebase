import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

import { FlatList, PanResponder } from 'react-native';

import { styles } from './styles';
import { Product, ProductProps } from '../Product';

// import { shoppingListExample } from '../../utils/shopping.list.data';

export function ShoppingList() {
  const [products, setProducts] = useState<ProductProps[]>([]);

  // useEffect(() => {
  //   firestore()
  //   .collection('products')
  //   .get()
  //   .then( response => {
  //     const data = response.docs.map( doc =>{
  //       return {
  //         id: doc.id,
  //         ...doc.data()
  //       }
  //     }) as ProductProps[]
  //     setProducts(data);
  //   })
  //   .catch(error => console.error(error))
  // },[])

  // useEffect(() => {
  //   const subscribe = firestore()
  //   .collection('products') // all
  //   .onSnapshot( querySnapshot => {
  //     const data = querySnapshot.docs.map( (doc) =>{
  //       return {
  //         id: doc.id,
  //         ...doc.data()
  //       }
  //     }) as ProductProps[]
  //     setProducts(data);
  //   })
  //   return () =>subscribe()
  // },[])

  // useEffect(() => {
  //   firestore()
  //   .collection('products') // somente 1
  //   .doc('2wmWsNKCY7iQ2SAkWfGz')
  //   .get()
  //   .then( response => {
  //     console.log({
  //       id: response.id,
  //       ...response.data()
  //     });
  //    })
  // },[])

  // filtros
  useEffect(() => {
    const subscribe = firestore()
    .collection('products') 
    // where com os operadores de comparação >, >=, <, <=, ==, !=
    // .where('quantity', '>=', 2)
    
    // Limites da consulta aos documentos
    //.limit(1)
    
    // Ordenar a consulta
    // .orderBy('description', 'desc') // descendente
    // .orderBy('description') // ascendente

    // a obrigatoriedade do uso da clausula orderBy
    .orderBy('quantity')    
    .startAt(2) // startAfter, startBefore
    .endAt(5) // endAfter, endBefore

    .onSnapshot( querySnapshot => {
      const data = querySnapshot.docs.map( (doc) =>{
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as ProductProps[]
      setProducts(data);
    })
    return () =>subscribe()
  },[])

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <Product data={item} />}
      showsVerticalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.content}
    />
  );
}
