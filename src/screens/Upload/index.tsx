import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import storage from '@react-native-firebase/storage';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';

import { Container, Content, Progress, Transferred } from './styles';

export function Upload() {
  const [image, setImage] = useState('');
  const [bytesTransferred, setBytesTransferred] = useState('');
  const [progress, setProgress] = useState('0');

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status == 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  };

  async function handleUpload(){
    // criou um nome para o arquivo
    const fileName = new Date().getTime(); // valor timestamp de data+hora do momento
    // pegar a extensão da imagem
    const MIME = image.match(/\.(?:.(?!\.))+$/);
    console.log(MIME);
    console.log(image);
    // pegar a referencia de onde o arquivo vai ser salvo
    const reference = storage().ref(`/images/${fileName}${MIME}`);

    // upload
    // reference
    // .putFile(image)
    // .then( () => Alert.alert('Upload concluído!!!'))
    // .catch( (error) => console.log(error));

    const uploadTask = reference.putFile(image);
    uploadTask.on('state_changed', taskSnapshot =>{
      // percentual de total de bytes transferidos / por total de bytes que contem o arquivo
      const percent = ((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100).toFixed(0);
      setProgress(percent);
      setBytesTransferred(`${taskSnapshot.bytesTransferred} transferidos de ${taskSnapshot.totalBytes}`)
    })

    uploadTask.then( () => {
      Alert.alert('Upload concluído com sucesso!!!')
    })

  }

  return (
    <Container>
      <Header title="Lista de compras" />

      <Content>
        <Photo uri={image} onPress={handlePickImage} />

        <Button
          title="Fazer upload"
          onPress={handleUpload}
        />

        <Progress>
          {progress}%
        </Progress>

        <Transferred>
          {bytesTransferred} 
        </Transferred>
      </Content>
    </Container>
  );
}
