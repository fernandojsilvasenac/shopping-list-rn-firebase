import React, { useState, useEffect } from 'react';
import { Alert, FlatList } from 'react-native';
import storage from '@react-native-firebase/storage';

import { Container, PhotoInfo } from './styles';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';
import { File, FileProps } from '../../components/File';

// import { photosData } from '../../utils/photo.data';

export function Receipts() {
  const [photos, setPhotos] = useState<FileProps[]>([]);
  //3
  const [photoSelected, setPhotoSelected] = useState('');
  //6
  const [photoInfo, setPhotoInfo] = useState('');

  //2
  async function handleShowImage(path:string){
    const urlImage = await storage().ref(path).getDownloadURL();
    //4
    setPhotoSelected(urlImage)

    //8 metadata das photos
    const info = await storage().ref(path).getMetadata();
    setPhotoInfo(`Upload realizado em ${info.timeCreated} | ${info.size}`)

  }

  //10
  async function handleDeleteImage(path:string){
    storage()
      .ref(path)
      .delete()
      .then( () =>{ 
        Alert.alert('Imagem excluída com sucesso!');
        //12
        fetchImages();
      })
      .catch( (error) => console.error(error))
  }


  // 11 criar a função pra listar novamente as imagens após deletar
  async function fetchImages(){
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
  }
  useEffect(() =>{
    //13
    fetchImages();
  },[])



  return (
    <Container>
      <Header title="Comprovantes" />
      {/* 5 */}
      <Photo uri={photoSelected} />

      <PhotoInfo>
        {/* 7 */}
        {photoInfo}
      </PhotoInfo>

      <FlatList
        data={photos}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <File
            data={item}
            onShow={() => handleShowImage(item.path)} //1
            onDelete={() => handleDeleteImage(item.path)} //9
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', padding: 24 }}
      />
    </Container>
  );
}
