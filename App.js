import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, SafeAreaView, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [likes, setLikes] = useState(124);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Property Media Background */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.backgroundImage}
      />

      {/* Overlay Gradient/Shadow effect */}
      <View style={styles.overlay} />

      {/* Top Header - RERA Badge */}
      <View style={styles.header}>
        <View style={styles.reraBadge}>
          <Text style={styles.reraText}>✓ RERA VERIFIED</Text>
        </View>
        <Text style={styles.logoText}>PropTok</Text>
      </View>

      {/* Right Interaction Sidebar */}
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
          <Text style={styles.iconText}>{isLiked ? '❤️' : '🤍'}</Text>
          <Text style={styles.iconLabel}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>💬</Text>
          <Text style={styles.iconLabel}>45</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>🔖</Text>
          <Text style={styles.iconLabel}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>↗️</Text>
          <Text style={styles.iconLabel}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Property Details */}
      <View style={styles.bottomDetails}>
        <Text style={styles.price}>AED 4,200,000</Text>
        <Text style={styles.title}>Luxury Glass Villa | Palm Jumeirah</Text>
        <Text style={styles.specs}>🛏️ 4 Beds  •  🚿 5 Baths  •  📐 4,500 sqft</Text>
        
        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.roiButton}>
            <Text style={styles.roiText}>📊 ROI Calc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.consultButton}>
            <Text style={styles.consultText}>💬 Consult Expert</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  reraBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  reraText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  logoText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sidebar: {
    position: 'absolute',
    right: 15,
    bottom: 180,
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 28,
  },
  iconLabel: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  bottomDetails: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 80,
  },
  price: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 4,
  },
  specs: {
    color: '#DDD',
    fontSize: 13,
    marginTop: 6,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  roiButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  roiText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  consultButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  consultText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
