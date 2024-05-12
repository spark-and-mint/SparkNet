export enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_MEMBER_ACCOUNT = "createMemberAccount",

  // MEMBER KEYS
  GET_CURRENT_MEMBER = "getCurrentMember",
  GET_MEMBERS = "getMembers",
  GET_MEMBER_BY_ID = "getMemberById",
  GET_MEMBER_STATUS = "getMemberStatus",
  GET_PROFILES = "getProfiles",

  // CLIENT KEYS
  GET_CLIENTS = "getClients",
  GET_CLIENT_BY_ID = "getClientById",

  // STAKEHOLDER KEYS
  GET_STAKEHOLDERS = "getStakeholders",

  // PROJECT KEYS
  GET_PROJECT_BY_ID = "getProjectById",
  GET_CLIENT_PROJECTS = "getClientProjects",
  GET_PROJECT_TEAM = "getProjectTeam",

  // OPPORTUNITY KEYS
  GET_OPPORTUNITY_BY_ID = "getOpportunityById",
  GET_CLIENT_OPPORTUNITIES = "getClientOpportunities",
  GET_MEMBER_OPPORTUNITIES = "getMemberOpportunities",

  // MILESTONE KEYS
  GET_PROJECT_MILESTONES = "getProjectMilestones",
  GET_MILESTONE_UPDATES = "getMilestoneUpdates",
  GET_MILESTONE_BY_ID = "getMilestoneById",

  // REQUEST KEYS
  GET_REQUEST_STATUS = "getRequestStatus",
  GET_REQUESTS = "getRequests",
}
