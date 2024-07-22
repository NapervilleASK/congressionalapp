import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, Image } from 'react-native';
import { Card, Text, Button, ActivityIndicator, MD2Colors } from 'react-native-paper';

const { height } = Dimensions.get('window');

const placeholderImage = require('@/assets/images/no_image.png');

const NewsDashboard = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://congressionalappserver3.vercel.app/news')
      .then((response) => response.json())
      .then((data) => {
        setNewsData(data.articles);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching news data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator animating={true} color={MD2Colors.red800} />;
  }

  return (
    <ScrollView
      style={styles.scrollView}
      snapToInterval={height * 0.4}
      snapToAlignment="center"
      decelerationRate="fast"
    >
      {newsData.map((article: any, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text variant="displayLarge" style={styles.title}>
                {article.title}
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                {article.date} - {article.authors[0]?.name || 'Unknown'}
              </Text>
              <Text variant="bodyMedium" style={styles.snippet}>
                {article.body.substring(0, 300)}...
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image 
                source={article.image ? { uri: article.image } : placeholderImage} 
                style={styles.image} 
                resizeMode="cover" 
              />
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  card: {
    height: height * 0.37,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    lineHeight: 35,
  },
  subtitle: {
    fontSize: 18, 
    color: 'gray',
    marginBottom: 10,
  },
  snippet: {
    fontSize: 16,
    marginTop: 5,
  },
  imageContainer: {
    width: '40%',
    justifyContent: 'center', // Center the image and button vertically
  },
  image: {
    width: 550,
    height: 250,
  },
  button: {
    width: '100%',
    height: '15%',
  },
});

export default NewsDashboard;
