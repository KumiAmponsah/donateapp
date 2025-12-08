import { StyleSheet } from 'react-native';

export const signupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#000',
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  signupButton: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  // Add these styles to your existing signupStyles
typeContainer: {
  flexDirection: 'row',
  marginBottom: 20,
  gap: 10,
},
typeButton: {
  flex: 1,
  padding: 12,
  borderRadius: 8,
  backgroundColor: '#f0f0f0',
  alignItems: 'center',
},
typeButtonActive: {
  backgroundColor: '#000',
},
typeText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#666',
},
typeTextActive: {
  color: '#fff',
},
// Add this to your existing signupStyles
disabledButton: {
  backgroundColor: '#cccccc',
  opacity: 0.7,
},
});
export default signupStyles;