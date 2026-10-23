import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

// Supabase Connection using GitHub Secrets
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const { width, height } = Dimensions.get('window');

// Default sample data for Dubai properties
const INITIAL_PROPERTIES = [
  {
    id: '1',
    title: 'Luxury Villa in Palm Jumeirah',
    price: 'AED 15,000,000',
    location: 'Palm Jumeirah, Dubai',
    beds: '5 Beds',
    baths: '6 Baths',
    area: '7,500 sqft',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
    agent: 'Dubai Luxury Real Estate',
    description: 'Exclusive beachfront villa with private pool, panoramic sea views, and ultra-modern finishings in Palm Jumeirah.'
  },
  {
    id: '2',
    title: 'Downtown Modern Apartment',
    price: 'AED 3,200,000',
    location: 'Downtown Dubai',
    beds: '2 Beds',
    baths: '3 Baths',
    area: '1,450 sqft',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    agent: 'Emaar Properties Partner',
    description: 'High-floor apartment with full Burj Khalifa and Fountain views. Walking distance to Dubai Mall.'
  },
  {
    id: '3',
    title: 'Marina Waterfront Penthouse',
    price: 'AED 8,500,000',
    location: 'Dubai Marina',
    beds: '4 Beds',
    baths: '5 Baths',
    area: '4,200 sqft',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    agent: 'Marina Exclusive Homes',
    description: 'Stunning penthouse with private terrace jacuzzi, maid room, and full view of Dubai Marina yacht club.'
  }
];

export default function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [adminModalVisible, setAdminModalVisible] = useState(false);

  // New Property Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newBeds, setNewBeds] = useState('');
  const [newBaths, setNewBaths] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newAgent, setNewAgent] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('id', { ascending: false });

        if (error || !data || data.length === 0) {
          setProperties(INITIAL_PROPERTIES);
        } else {
          setProperties(data);
        }
      } catch (e) {
        setProperties(INITIAL_PROPERTIES);
      }
    } else {
      setProperties(INITIAL_PROPERTIES);
    }
    setLoading(false);
  };

  const handleAddProperty = async () => {
    if (!newTitle || !newPrice || !newLocation) {
      Alert.alert('Error', 'Please fill in Title, Price, and Location.');
      return;
    }

    const newProp = {
      title: newTitle,
      price: newPrice.includes('AED') ? newPrice : `AED ${newPrice}`,
      location: newLocation,
      beds: newBeds ? `${newBeds} Beds` : '3 Beds',
      baths: newBaths ? `${newBaths} Baths` : '3 Baths',
      area: newArea ? `${newArea} sqft` : '1,500 sqft',
      image: newImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      agent: newAgent || 'Dubai Real Estate Agent',
      description: newDescription || 'Premium property available for sale/rent in prime Dubai location.'
    };

    if (supabase) {
      const { data, error } = await supabase.from('properties').insert([newProp]).select();
      if (error) {
        Alert.alert('Notice', 'Added locally (Supabase table pending).');
        setProperties([ { ...newProp, id: Date.now().toString() }, ...properties ]);
      } else if (data) {
        setProperties([ data[0], ...properties ]);
        Alert.alert('Success', 'Property added to live database!');
      }
    } else {
      setProperties([ { ...newProp, id: Date.now().toString() }, ...properties ]);
      Alert.alert('Success', 'Property added to local feed!');
    }

    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewLocation('');
    setNewBeds('');
    setNewBaths('');
    setNewArea('');
    setNewImage('');
    setNewAgent('');
    setNewDescription('');
    setAdminModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image source={{ uri: item.image }} style={styles.propertyImage} />
      
      {/* Overlay Details */}
      <View style={styles.overlay}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.price}</Text>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>

        <View style={styles.specsRow}>
          <Text style={styles.specText}>🛏️ {item.beds}</Text>
          <Text style={styles.specText}>🚿 {item.baths}</Text>
          <Text style={styles.specText}>📐 {item.area}</Text>
        </View>

        <TouchableOpacity 
          style={styles.detailsButton} 
          onPress={() => {
            setSelectedProperty(item);
            setModalVisible(true);
          }}
        >
          <Text style={styles.detailsButtonText}>View Full Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PropTok Dubai</Text>
        <TouchableOpacity 
          style={styles.addNavButton}
          onPress={() => setAdminModalVisible(true)}
        >
          <Text style={styles.addNavButtonText}>+ Add Property</Text>
        </TouchableOpacity>
      </View>

      {/* Feed */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF385C" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Loading Dubai Properties...</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={height - 70}
          decelerationRate="fast"
        />
      )}

      {/* Property Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProperty && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: selectedProperty.image }} style={styles.modalImage} />
                <Text style={styles.modalPrice}>{selectedProperty.price}</Text>
                <Text style={styles.modalTitle}>{selectedProperty.title}</Text>
                <Text style={styles.modalLocation}>📍 {selectedProperty.location}</Text>

                <View style={styles.modalSpecs}>
                  <Text style={styles.modalSpecItem}>🛏️ {selectedProperty.beds}</Text>
                  <Text style={styles.modalSpecItem}>🚿 {selectedProperty.baths}</Text>
                  <Text style={styles.modalSpecItem}>📐 {selectedProperty.area}</Text>
                </View>

                <Text style={styles.sectionHeading}>Agent Information</Text>
                <Text style={styles.agentText}>🏢 {selectedProperty.agent}</Text>

                <Text style={styles.sectionHeading}>Description</Text>
                <Text style={styles.descriptionText}>{selectedProperty.description}</Text>

                <TouchableOpacity style={styles.contactButton} onPress={() => Alert.alert('Contact Agent', 'Agent contact functionality triggered!')}>
                  <Text style={styles.contactButtonText}>📞 Contact Agent / Inquiry</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Property Admin Modal */}
      <Modal visible={adminModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Add New Dubai Property</Text>

              <TextInput style={styles.input} placeholder="Title (e.g. Villa in Marina)" placeholderTextColor="#888" value={newTitle} onChangeText={setNewTitle} />
              <TextInput style={styles.input} placeholder="Price in AED (e.g. 5,000,000)" placeholderTextColor="#888" value={newPrice} onChangeText={setNewPrice} />
              <TextInput style={styles.input} placeholder="Location (e.g. Business Bay)" placeholderTextColor="#888" value={newLocation} onChangeText={setNewLocation} />
              <TextInput style={styles.input} placeholder="Bedrooms (e.g. 3)" placeholderTextColor="#888" value={newBeds} onChangeText={setNewBeds} />
              <TextInput style={styles.input} placeholder="Bathrooms (e.g. 4)" placeholderTextColor="#888" value={newBaths} onChangeText={setNewBaths} />
              <TextInput style={styles.input} placeholder="Area sqft (e.g. 2,200)" placeholderTextColor="#888" value={newArea} onChangeText={setNewArea} />
              <TextInput style={styles.input} placeholder="Image Direct URL" placeholderTextColor="#888" value={newImage} onChangeText={setNewImage} />
              <TextInput style={styles.input} placeholder="Agent / Agency Name" placeholderTextColor="#888" value={newAgent} onChangeText={setNewAgent} />
              <TextInput style={[styles.input, { height: 80 }]} multiline placeholder="Full Description" placeholderTextColor="#888" value={newDescription} onChangeText={setNewDescription} />

              <TouchableOpacity style={styles.submitButton} onPress={handleAddProperty}>
                <Text style={styles.submitButtonText}>Publish Property</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => setAdminModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    height: 50,
    backgroundColor: '#121212',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  },
  headerTitle: { color: '#FF385C', fontSize: 20, fontWeight: 'bold' },
  addNavButton: { backgroundColor: '#FF385C', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  addNavButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardContainer: { width: width, height: height - 70, justifyContent: 'flex-end' },
  propertyImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  overlay: { padding: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  badge: { backgroundColor: '#FF385C', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15, marginBottom: 8 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  location: { color: '#ddd', fontSize: 14, marginBottom: 10 },
  specsRow: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  specText: { color: '#fff', fontSize: 14, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  detailsButton: { backgroundColor: '#fff', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  detailsButtonText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1A1A1A', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, maxHeight: height * 0.85 },
  modalImage: { width: '100%', height: 220, borderRadius: 15, marginBottom: 15 },
  modalPrice: { color: '#FF385C', fontSize: 24, fontWeight: 'bold' },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 5 },
  modalLocation: { color: '#aaa', fontSize: 14, marginBottom: 15 },
  modalSpecs: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#2A2A2A', padding: 12, borderRadius: 10, marginBottom: 15 },
  modalSpecItem: { color: '#fff', fontWeight: '600' },
  sectionHeading: { color: '#FF385C', fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  agentText: { color: '#fff', fontSize: 15, marginBottom: 10 },
  descriptionText: { color: '#ccc', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  contactButton: { backgroundColor: '#25D366', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  contactButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  closeButton: { backgroundColor: '#333', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
  input: { backgroundColor: '#2A2A2A', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 14 },
  submitButton: { backgroundColor: '#FF385C', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
