import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import storage from '@react-native-firebase/storage';

import { Container, PhotoInfo } from './styles';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';
import { File, FileProps } from '../../components/File';

// import { photosData } from '../../utils/photo.data';

export function Receipts() {
  const [photos, setPhotos] = useState<FileProps[]>([]);

  useEffect(() =>{
    //ref das imagens .list lista as imagens da pasta 'images'
    // é necessário montar um array com o resultado da lisagem em result.items
    storage().ref('images').list().then( result =>{
      const files: FileProps[] = [];

      result.items.forEach(file =>{
        files.push({
          name: file.name,
          path: file.fullPath
        })
      })

      setPhotos(files)
    })
  },[])


  return (
    <Container>
      <Header title="Comprovantes" />

      <Photo uri="" />

      <PhotoInfo>
        Informações da foto
      </PhotoInfo>

      <FlatList
        data={photos}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <File
            data={item}
            onShow={() => { }}
            onDelete={() => { }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', padding: 24 }}
      />
    </Container>
  );
}
