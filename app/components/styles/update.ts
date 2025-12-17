// Add to your existing updateStyles or create a new file
import { StyleSheet } from 'react-native';

export const updateStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Header Section (existing styles remain)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  headerStats: {
    marginLeft: 15,
  },
  statPill: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 80,
  },
  statPillNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 2,
  },
  statPillLabel: {
    fontSize: 10,
    color: '#718096',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // Create Update Button
  createUpdateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5568',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 5,
    marginBottom: 25,
    alignSelf: 'flex-start',
  },
  createUpdateIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFFFFF',
    marginRight: 8,
  },
  createUpdateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Timeline Container
  timelineContainer: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  timelineFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timelineFilterText: {
    fontSize: 12,
    color: '#4A5568',
    marginRight: 6,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  filterIcon: {
    width: 14,
    height: 14,
    tintColor: '#4A5568',
  },

  // Timeline Items
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineLineContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 5,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A5568',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
    marginBottom: -8,
  },

  // Update Card - Enhanced
  updateCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lastUpdateCard: {
    marginBottom: 40,
  },
  cardAccent: {
    width: 4,
    backgroundColor: '#4A5568',
  },
  cardContent: {
    flex: 1,
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  organizationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  organizationAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: '#F7FAFC',
  },
  organizationAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  organizationAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  organizationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 2,
  },
  campaignText: {
    fontSize: 10,
    color: '#718096',
    fontStyle: 'italic',
  },
  dateText: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
    lineHeight: 22,
  },
  updateDescription: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flex: 1,
  },
  categoryPill: {
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4A5568',
    textTransform: 'capitalize',
  },
  readTimeText: {
    fontSize: 10,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  progressLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#EDF2F7',
  },
  updateImage: {
    width: 100,
    height: '100%',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },

  updatesList: {
    flex: 1,
  },
  bottomSpacing: {
    height: 20,
  },

  // Loading and empty states
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 16,
  },
  noUpdatesContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 24,
    tintColor: '#CBD5E0',
  },
  noUpdatesText: {
    fontSize: 18,
    color: '#4A5568',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  noUpdatesSubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  clearFilterButton: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  clearFilterText: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '600',
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
});

export default updateStyles;