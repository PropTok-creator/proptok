import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Initial Mock Data
const INITIAL_PROPERTIES = [
  {
    id: '1',
    title: '3 Bed Luxury Apartment in DHA Phase 6',
    price: 'PKR 3.5 Crore',
    location: 'Karachi, Pakistan',
    beds: '3',
    baths: '3',
    area: '2000 Sqft',
    agent: 'PropTok Platinum Agent',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    likes: 1200,
    comments: 45,
    description: 'Beautiful luxury apartment with sea view, spacious bedrooms, and modern fittings in the heart of DHA Phase 6.',
    phone: '+92 300 1234567'
  },
  {
    id: '2',
    title: 'Modern Villa with Private Pool',
    price: 'PKR 8.2 Crore',
    location: 'Gulberg, Lahore',
    beds: '5',
    baths: '6',
    area: '4500 Sqft',
    agent: 'Estate Masters',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    likes: 3400,
    comments: 120,
    description: 'Designer villa with private swimming pool, basement theater, and Italian kitchen.',
    phone: '+92 321 7654321'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [likedItems, setLikedItems] = useState({});
  const [savedItems, setSavedItems] = useState({});

  // Form State for Adding Property
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newBeds, setNewBeds] = useState('');
  const [newBaths, setNewBaths] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newImage, setNewImage] = useState('');

  // Handle Like Button Toggle
  const toggleLike = (id) => {
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: likedItems[id] ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  // Handle Save Property Toggle
  const toggleSave = (id) => {
    setSavedItems(prev => ({ ...prev, [id]: !prev[id] }));
    Alert.alert("PropTok", savedItems[id] ? "Removed from Saved" : "Property Saved Successfully!");
  };

  // Add New Property (Admin Mode)
  const handleAddProperty = () => {
    if (!newTitle || !newPrice || !newLocation) {
      Alert.alert("Error", "Please fill in Title, Price, and Location!");
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      title: newTitle,
      price: newPrice,
      location: newLocation,
      beds: newBeds || '3',
      baths: newBaths || '3',
      area: newArea || '1000 Sqft',
      agent: 'Admin Upload',
      image: newImage || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      likes: 0,
      comments: 0,
      description: 'Newly added property listed via PropTok Admin Panel.',
      phone: '+92 300 0000000'
    };

    setProperties([newEntry, ...properties]);
    Alert.alert("Success", "New Property Added to Feed!");
    
    // Clear Form
    setNewTitle('');
    setNewPrice('');
    setNewLocation('');
    setNewBeds('');
    setNewBaths('');
    setNewArea('');
    setNewImage('');
    
    setActiveTab('Home');
  };

  // Render Card for Feed
  const renderPropertyCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image source={{ uri: item.image }} style={styles.propertyImage} />
      <View style={styles.overlay} />

      {/* Action Buttons (Right Side) */}
      <View style={styles.rightBar}>
        <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
          <Text style={styles.actionIcon}>{likedItems[item.id] ? '❤️' : '🤍'}</Text>
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setSelectedProperty(item)}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => toggleSave(item.id)}>
          <Text style={styles.actionIcon}>{savedItems[item.id] ? '🔖' : '📑'}</Text>
          <Text style={styles.actionText}>{savedItems[item.id] ? 'Saved' : 'Save'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("WhatsApp Chat", `Connecting to agent at ${item.phone}`)}>
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
      </View>

      {/* Property Information overlay */}
      <View style={styles.bottomInfo}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.agent}</Text>
        </View>

        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>

        <View style={styles.featuresRow}>
          <Text style={styles.featureChip}>🛏️ {item.beds} Beds</Text>
          <Text style={styles.featureChip}>🚿 {item.baths} Baths</Text>
          <Text style={styles.featureChip}>📐 {item.area}</Text>
        </View>

        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => setSelectedProperty(item)}
        >
          <Text style={styles.detailsButtonText}>View Full Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PropTok</Text>
        <View style={styles.topTabs}>
          <Text style={[styles.topTabText, styles.activeTopTab]}>For You</Text>
          <Text style={styles.topTabText}>Following</Text>
        </View>
      </View>

      {/* SCREEN NAVIGATION CONTENT */}
      {activeTab === 'Home' && (
        <FlatList
          data={properties}
          renderItem={renderPropertyCard}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={height - 110}
          snapToAlignment="start"
        />
      )}

      {activeTab === 'Search' && (
        <View style={styles.screenView}>
          <Text style={styles.screenHeader}>Search Properties</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Search by Location, City, or Title..." 
            placeholderTextColor="#888" 
          />
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Quick Filters:</Text>
            <View style={styles.featuresRow}>
              <Text style={styles.featureChip}>Karachi</Text>
              <Text style={styles.featureChip}>Lahore</Text>
              <Text style={styles.featureChip}>Islamabad</Text>
              <Text style={styles.featureChip}>Apartments</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'Add' && (
        <ScrollView style={styles.screenView}>
          <Text style={styles.screenHeader}>Add New Property (Admin)</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="Property Title (e.g., 3 Bed Flat)" 
            placeholderTextColor="#888" 
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Price (e.g., PKR 2.5 Crore)" 
            placeholderTextColor="#888" 
            value={newPrice}
            onChangeText={setNewPrice}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Location (e.g., Clifton, Karachi)" 
            placeholderTextColor="#888" 
            value={newLocation}
            onChangeText={setNewLocation}
          />
          <View style={{flexDirection: 'row', gap: 10}}>
            <TextInput 
              style={[styles.input, {flex: 1}]} 
              placeholder="Beds" 
              placeholderTextColor="#888" 
              value={newBeds}
              onChangeText={setNewBeds}
            />
            <TextInput 
              style={[styles.input, {flex: 1}]} 
              placeholder="Baths" 
              placeholderTextColor="#888" 
              value={newBaths}
              onChangeText={setNewBaths}
            />
          </View>
          <TextInput 
            style={styles.input} 
            placeholder="Image URL (Optional)" 
            placeholderTextColor="#888" 
            value={newImage}
            onChangeText={setNewImage}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleAddProperty}>
            <Text style={styles.submitBtnText}>Publish Property</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {activeTab === 'Saved' && (
        <View style={styles.screenView}>
          <Text style={styles.screenHeader}>Saved Properties</Text>
          <Text style={{color: '#aaa', marginTop: 10}}>
            {Object.keys(savedItems).length > 0 ? "You have saved items in your list." : "No saved properties yet."}
          </Text>
        </View>
      )}

      {activeTab === 'Profile' && (
        <View style={styles.screenView}>
          <Text style={styles.screenHeader}>Admin Profile</Text>
          <View style={styles.profileCard}>
            <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>PropTok Super Admin</Text>
            <Text style={{color: '#007aff', marginTop: 5}}>admin@proptok.com</Text>
            <Text style={{color: '#aaa', marginTop: 15}}>Total Listed Properties: {properties.length}</Text>
          </View>
        </View>
      )}

      {/* FULL DETAILS MODAL */}
      <Modal visible={selectedProperty !== null} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedProperty && (
              <>
                <Text style={styles.modalTitle}>{selectedProperty.title}</Text>
                <Text style={styles.modalPrice}>{selectedProperty.price}</Text>
                <Text style={{color: '#ccc', marginVertical: 5}}>📍 {selectedProperty.location}</Text>
                <Text style={styles.modalDesc}>{selectedProperty.description}</Text>
                <Text style={{color: '#007aff', fontWeight: 'bold', marginVertical: 10}}>Contact Agent: {selectedProperty.phone}</Text>

                <TouchableOpacity 
                  style={styles.closeBtn} 
                  onPress={() => setSelectedProperty(null)}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Close Details</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveTab('Home')}>
          <Text style={[styles.navIcon, activeTab === 'Home' && styles.activeNav]}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('Search')}>
          <Text style={[styles.navIcon, activeTab === 'Search' && styles.activeNav]}>🔍</Text>
          <Text style={styles.navLabel}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addPropertyBtn} onPress={() => setActiveTab('Add')}>
          <Text style={styles.addPropertyText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('Saved')}>
          <Text style={[styles.navIcon, activeTab === 'Saved' && styles.activeNav]}>🔖</Text>
          <Text style={styles.navLabel}>Saved</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('Profile')}>
          <Text style={[styles.navIcon, activeTab === 'Profile' && styles.activeNav]}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    position: 'absolute', top: 40, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20,
  },
  headerTitle: { color: '#007aff', fontSize: 22, fontWeight: 'bold' },
  topTabs: { flexDirection: 'row', gap: 15 },
  topTabText: { color: '#888', fontSize: 16, fontWeight: '600' },
  activeTopTab: { color: '#fff', borderBottomWidth: 2, borderBottomColor: '#007aff' },
  
  cardContainer: { width: width, height: height - 110, justifyContent: 'flex-end' },
  propertyImage: { ...StyleSheet.absoluteFillObject, width: width, height: '100%', resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  
  rightBar: { position: 'absolute', right: 15, bottom: 120, alignItems: 'center', gap: 18 },
  actionButton: { alignItems: 'center' },
  actionIcon: { fontSize: 28 },
  actionText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  
  bottomInfo: { padding: 20, paddingBottom: 30, width: width - 80 },
  badge: { backgroundColor: '#007aff', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginBottom: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  price: { color: '#4cd964', fontSize: 24, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 18, fontWeight: '600', marginVertical: 4 },
  location: { color: '#ccc', fontSize: 14 },
  featuresRow: { flexDirection: 'row', gap: 8, marginVertical: 10 },
  featureChip: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12 },
  detailsButton: { backgroundColor: '#007aff', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  detailsButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  screenView: { flex: 1, marginTop: 90, paddingHorizontal: 20 },
  screenHeader: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#111', color: '#fff', borderColor: '#333', borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 },
  submitBtn: { backgroundColor: '#007aff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  filterContainer: { marginTop: 20 },
  filterTitle: { color: '#aaa', marginBottom: 10 },
  profileCard: { backgroundColor: '#111', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#333' },

  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: '#1c1c1e', padding: 25, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  modalPrice: { color: '#4cd964', fontSize: 22, fontWeight: 'bold', marginVertical: 5 },
  modalDesc: { color: '#aaa', marginVertical: 10, lineHeight: 20 },
  closeBtn: { backgroundColor: '#007aff', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 15 },

  bottomNav: { height: 60, backgroundColor: '#111', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#333' },
  navIcon: { fontSize: 20, textAlign: 'center', opacity: 0.6 },
  activeNav: { opacity: 1 },
  navLabel: { color: '#fff', fontSize: 10, marginTop: 2, textAlign: 'center' },
  addPropertyBtn: { backgroundColor: '#007aff', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  addPropertyText: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: -2 },
});
