import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';


import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';

import { Container, Content, Progress, Transferred } from './styles';
import { Alert } from 'react-native';

export function Upload() {
  const [image, setImage] = useState('');
  //2
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
    const fileName = new Date().getTime();
    //4
    //deixar o nome do arquivo e extensão dinâmica
    const MIME = image.match(/\.(?:.(?!\.))+$/);
    // const reference = storage().ref(`/images/${fileName}${MIME}`);

    // pegou a referencia onde o arquivo vai ser salvo
    const reference = storage().ref(`/images/${fileName}.png`);

    //1ª
    // reference
    // .putFile(image)
    // .then( () => Alert.alert('Upload concluído!!!'))
    // .catch( (error) => console.log(error));

    //3
    const uploadTask = reference.putFile(image)
    // escutando as mudanças do upload on.state_changed...
    uploadTask.on('state_changed', taskSnapshot => {
      // percentual de total de bytes transferidos / por total de baytes que contem o arquivo /dividido por 100, vai dar o percentual
      const percent = ((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *100).toFixed(0);
      // atualizando o estado e mostrando abaixo 
      setProgress(percent);
      // atualizando o texto abaixo da imagem
      setBytesTransferred(`${taskSnapshot.bytesTransferred} transferido de ${taskSnapshot.totalBytes}`)

    })
    //quando terminar o upload, informar ao usuario
    uploadTask.then( () => {
      Alert.alert('Upload concluído com sucesso!!!')
    })

  }

  return (
    <Container>
      <Header title="Uploads de Fotos" />

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
