import { StyleSheet } from 'react-native';

export const updateStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  
  // Header Section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 60,
    marginBottom: 30,
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
  },
  filterIcon: {
    width: 12,
    height: 12,
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

  // Update Card
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
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lastUpdateCard: {
    marginBottom: 120,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  organizationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A5568',
    marginRight: 8,
  },
  organizationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  newCategoryPill: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FED7D7',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4A5568',
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

  updatesList: {
    flex: 1,
  },
  bottomSpacing: {
    height: 20,
  },

  // New styles for loading and empty states
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#718096',
  },
  noUpdatesContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noUpdatesText: {
    fontSize: 16,
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
  },
});

export default updateStyles;