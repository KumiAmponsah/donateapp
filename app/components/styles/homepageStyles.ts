import { StyleSheet } from 'react-native';

export const homepageStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 0,
  },
  content: {
    marginTop: 60,
    paddingBottom: 0,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 43,
    height: 43,
    borderRadius: 21.5,
    backgroundColor: '#4A5568',
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 43,
    height: 43,
    borderRadius: 21.5,
    backgroundColor: '#4A5568',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 1,
  },
  nameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  
  // Stats section styles
  statsContainer: {
    marginBottom: 30,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statItem: {
    marginBottom: 17,
  },
  lastStatItem: {
    marginBottom: 0,
  },
  statItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    tintColor: '#4A5568',
  },
  textContent: {
    flex: 1,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 2,
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
  },

  // Campaign Tab Styles
  campaignTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    width: '100%',
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
  campaignImageContainer: {
    height: 150,
    width: '100%',
  },
  campaignImage: {
    width: '100%',
    height: '100%',
  },
  campaignContent: {
    padding: 16,
  },
  campaignTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  campaignDescription: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A5568',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A5568',
    minWidth: 35,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountRaised: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  amountTarget: {
    fontSize: 14,
    color: '#718096',
  },
  donateButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4A5568',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  donateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  heartIcon: {
    width: 20,
    height: 20,
    tintColor: '#4A5568',
  },
  lastCampaignTab: {
    marginBottom: 110,
  },
});

export default homepageStyles;