import { StyleSheet, Platform } from 'react-native';

export const descriptionStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    padding: 15,
    paddingTop: 50,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '600',
  },
  imageContainer: {
    height: 250,
    width: '100%',
  },
  campaignImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressBarContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A5568',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
    marginBottom: 30,
  },
  donationSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  amountSection: {
    marginBottom: 25,
  },
  amountLabel: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 10,
  },
  amountInput: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 15,
  },
  presetAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetButton: {
    backgroundColor: '#4A5568',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  presetButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  paymentSection: {
    marginBottom: 25,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentOptionSelected: {
    borderColor: '#4A5568',
    backgroundColor: '#EDF2F7',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A5568',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A5568',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '600',
  },
  paymentIcon: {
    width: 24,
    height: 24,
    tintColor: '#4A5568',
  },
  paymentForm: {
    marginTop: 15,
    gap: 12,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  mobileMoneyNote: {
    fontSize: 12,
    color: '#A0AEC0',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5,
  },
  donateButton: {
    backgroundColor: '#4A5568',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    color: '#2D3748',
    textAlign: 'center',
    marginTop: 100,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    height: Platform.OS === 'android' ? 50 : 90,
    width: '100%',
  },
});

export default descriptionStyles;