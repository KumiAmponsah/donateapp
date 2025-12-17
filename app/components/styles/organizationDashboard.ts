// C:\Users\cypri\Documents\donateapp\app\components\styles\organizationDashboard.ts
// C:\Users\cypri\Documents\donateapp\app\components\styles\organizationDashboard.ts
import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const organizationDashboardStyles = StyleSheet.create({
  // Modal Container
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  
  // Modal Header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: '#4A5568',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A202C',
    flex: 1,
  },
  refreshHeaderButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
  },
  refreshIcon: {
    width: 20,
    height: 20,
    tintColor: '#4A5568',
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#F7FAFC',
  },
  tabIcon: {
    width: 24,
    height: 24,
    tintColor: '#A0AEC0',
    marginBottom: 6,
  },
  activeTabIcon: {
    tintColor: '#4A5568',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A0AEC0',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#4A5568',
    fontWeight: '600',
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#718096',
  },
  
  // Create Campaign Button
  createCampaignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  createCampaignButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createCampaignIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
    marginRight: 12,
  },
  createCampaignText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chevronIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flex: 1,
    minWidth: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pendingCard: {
    minWidth: '100%',
    borderColor: '#F6AD55',
    backgroundColor: '#FEFCBF',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 20,
    height: 20,
    tintColor: '#4A5568',
    marginRight: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },
  statDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDetailLabel: {
    fontSize: 12,
    color: '#718096',
    marginRight: 4,
  },
  statDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A202C',
  },
  pendingText: {
    fontSize: 12,
    color: '#D69E2E',
    marginTop: 4,
  },
  
  // Sections
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonIcon: {
    width: 16,
    height: 16,
    tintColor: '#4A5568',
    marginRight: 6,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
  },
  
  // Quick Links
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickLink: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickLinkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickLinkIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  quickLinkText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A5568',
    textAlign: 'center',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#4A5568',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Campaign Items
  campaignItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  lastCampaignItem: {
    borderBottomWidth: 0,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#C6F6D5',
  },
  statusCompleted: {
    backgroundColor: '#BEE3F8',
  },
  statusDraft: {
    backgroundColor: '#FED7D7',
  },
  statusCancelled: {
    backgroundColor: '#E2E8F0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  campaignStat: {
    alignItems: 'center',
  },
  campaignStatLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  campaignStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A202C',
  },
  
  // Progress Bar
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#48BB78',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'right',
  },
  
  // Pending Approval Banner
  pendingApprovalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCBF',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F6AD55',
  },
  pendingIcon: {
    width: 16,
    height: 16,
    tintColor: '#D69E2E',
    marginRight: 8,
  },
  
  // Donation Items
  donationItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  lastDonationItem: {
    borderBottomWidth: 0,
  },
  donationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  donorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  donorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  donorInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  donorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 2,
  },
  donorEmail: {
    fontSize: 12,
    color: '#718096',
  },
  donationAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#48BB78',
  },
  donationCampaign: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
  },
  donationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donationDate: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  donationTime: {
    fontSize: 12,
    color: '#A0AEC0',
    marginLeft: 8,
  },
  
  // View All Button
  viewAllButton: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
});
export default organizationDashboardStyles;