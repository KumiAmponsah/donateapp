import { StyleSheet } from 'react-native'; 

export const homepageStyles = StyleSheet.create({ 
  scrollView: { 
    flex: 1, 
  }, 
  scrollViewContent: { 
    flexGrow: 1, 
    paddingTop: 20, 
    paddingHorizontal: 20, 
    paddingBottom: 40, 
  }, 
  content: { 
    paddingBottom: 60, 
  }, 
  
  // Profile Section
  profileContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 30, 
    marginTop: 10, 
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
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#4A5568', 
    marginRight: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden',
  }, 
  iconCircle: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
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
    marginBottom: 2, 
  }, 
  nameText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#2D3748', 
  }, 
  icon: { 
    width: 20, 
    height: 20, 
    tintColor: '#FFFFFF', 
  }, 
  userAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  initialsContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Stats section styles 
  statsContainer: { 
    marginBottom: 30, 
    backgroundColor: '#F7FAFC', 
    borderRadius: 16, 
    paddingVertical: 20, 
    paddingHorizontal: 16, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 1, 
    }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2, 
  }, 
  statItem: { 
    marginBottom: 20, 
  }, 
  lastStatItem: { 
    marginBottom: 0, 
  }, 
  statItemContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
  }, 
  iconWrapper: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#EDF2F7', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16, 
  }, 
  statIcon: { 
    width: 28, 
    height: 28, 
    tintColor: '#4A5568', 
  }, 
  textContent: { 
    flex: 1, 
  }, 
  amountText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#2D3748', 
    marginBottom: 4, 
  }, 
  numberText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#2D3748', 
    marginBottom: 4, 
  }, 
  statLabel: { 
    fontSize: 13, 
    color: '#718096', 
  }, 

  // Campaigns Header
  campaignsHeader: {
    marginBottom: 20,
  },
  campaignsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  campaignsSubtitle: {
    fontSize: 14,
    color: '#718096',
  },

  // Campaign Tab Styles 
  campaignTab: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    overflow: 'hidden', 
    marginBottom: 20, 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 2, 
    }, 
    shadowOpacity: 0.08, 
    shadowRadius: 6, 
    elevation: 3, 
  }, 
  campaignImageContainer: { 
    height: 180, 
    width: '100%', 
  }, 
  campaignImage: { 
    width: '100%', 
    height: '100%', 
  }, 
  campaignContent: { 
    padding: 20, 
  }, 
  campaignTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#2D3748', 
    marginBottom: 4, 
    lineHeight: 24,
  }, 
  charityName: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  campaignDescription: { 
    fontSize: 14, 
    color: '#4A5568', 
    lineHeight: 22, 
    marginBottom: 20, 
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
    marginRight: 12, 
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
    minWidth: 40, 
  }, 
  amountContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8, 
  }, 
  amountRaised: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#2D3748', 
  }, 
  amountTarget: { 
    fontSize: 14, 
    color: '#718096', 
  }, 
  donorCount: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 20,
  },
  donateButton: { 
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    borderColor: '#4A5568', 
    borderRadius: 25, 
    paddingVertical: 14, 
    paddingHorizontal: 24, 
    alignItems: 'center', 
    justifyContent: 'center', 
    flexDirection: 'row', 
    gap: 10, 
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
    marginBottom: 40, 
  }, 
  
  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#718096',
    marginTop: 16,
  },
  noCampaignsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCampaignsIcon: {
    width: 100,
    height: 100,
    marginBottom: 24,
    tintColor: '#CBD5E0',
  },
  noCampaignsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#4A5568',
    fontWeight: '600',
    marginBottom: 8,
  },
  noCampaignsSubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#718096',
    marginBottom: 24,
    lineHeight: 20,
  },
  refreshButton: {
    backgroundColor: '#4A5568',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
   moreComingContainer: {
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F0F9FF', // Light blue background
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0F2FE', // Light blue border
    alignItems: 'center',
  },
  
  // More campaigns coming soon text
  moreComingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0369A1', // Blue text
    textAlign: 'center',
  },
  
  // User role text (for showing "Organization" under name)
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280', // Gray color
    marginTop: 2,
  },
  statDescription: {
  fontSize: 10,
  color: '#718096',
  marginTop: 2,
  fontFamily: 'Inter_400Regular',
},
donorSubtext: {
  fontSize: 11,
  color: '#718096',
  marginTop: 2,
  fontStyle: 'italic',
},
statSubtext: {
  fontSize: 10,
  color: '#718096',
  marginTop: 2,
  fontStyle: 'italic',
},
}); 

export default homepageStyles;