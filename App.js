import { StyleSheet, Text, View, Image } from 'react-native';
import Animated, {
 useSharedValue,
 useAnimatedStyle,
 withSpring,
 runOnJS //Kør kode på javascript tråden, i stedet for GUI tråden
} from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState } from 'react';


export default function App() {
  const [images, setImages] = useState([
    { id:'1', imageUrl: require('./assets/eagle.png')},
    { id:'2', imageUrl: require('./assets/dog.png')},
    { id:'3', imageUrl: require('./assets/zebra.png')}
  ])
 
 
  function handleSwipeOff(cardId){
    setImages(prevCards => prevCards.filter(card => card.id !== cardId))
  }
 
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
          {images.map((image)=>(
              <MyCard key={image.id} image={image.imageUrl} onSwipeOff={()=>handleSwipeOff(image.id)}/>
            ))
          }
    </GestureHandlerRootView>
  );
 }
 

const MyCard = ({image, onSwipeOff})=>{
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
 
 
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      rotate.value = (translateX.value / 250) * -10
    })
    .onEnd(() => {
      if(Math.abs(translateX.value) > 150){
        translateX.value = 500 // flyver ud til højre
        // fjern billede fra listen
        runOnJS(onSwipeOff)()
      }else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });
 
 
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg`},
      ],
    };
  });
 
 
  return (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle, styles.container]}>
            <Image source={image} style={styles.imgStyle} />
        </Animated.View>
      </GestureDetector>
  )
 }
 

const styles = StyleSheet.create({
  imgStyle:{
    width:200,
    height:200,
  },
  container:{
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent:'center'
  },
  box: {
   width: 100,
   height: 100,
   backgroundColor: 'blue',
   margin: 30,
 },
});



