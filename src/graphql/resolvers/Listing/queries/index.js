const Listing = require('../../../../models/Listing');
const User = require('../../../../models/User');
const { logger } = require('../../../../utils/logger');
const { superAdmin, admin, agent } = require('../../../../constants/userTypes');
const throwUnautorizedAccessError = require('../../../../utils/throwUnauthorizedError');

const PAGE_LENGTH = 5;

module.exports = {
  allListingsAdmin: async (obj, args, context, info) => {
    console.log('All Listings Admin');
    const { currentUser, req } = context;

    if (!currentUser) throwUnautorizedAccessError(req, info);

    if (currentUser.role !== superAdmin && currentUser.role !== admin) {
      throwUnautorizedAccessError(req, info);
    }

    try {
      listings = await Listing.find();
    } catch (err) {
      logger.log('error', JSON.stringify(err));
      throw err;
    }

    return listings;
  },

  allListings: async (obj, args, context, info) => {
    const { currentUser, req } = context;
    const { filters, orderby, page = 0 } = args;
    console.log(args);
    let listings, count;

    try {
      listings = await Listing.find(JSON.parse(filters))
        .sort(JSON.parse(orderby))
        .skip(PAGE_LENGTH * page)
        .limit(PAGE_LENGTH)
        .exec();
      count = await Listing.count(JSON.parse(filters));
    } catch (err) {
      logger.log('error', JSON.stringify(err));
      throw err;
    }

    return { listings, count };
  },

  allListingsByAgentName: async (obj, args, context, info) => {
    const { currentUser, req } = context;
    const { agentName } = args;
    let listings;

    if (!currentUser) throwUnautorizedAccessError(req, info);

    if (currentUser.role !== superAdmin && currentUser.role !== admin) {
      throwUnautorizedAccessError(req, info);
    }

    try {
      listings = await Listing.findByAgentName(agentName);
    } catch (err) {
      logger.log('error', JSON.stringify(err));
      throw err;
    }

    return listings;
  },

  allListingsByAgentID: async (obj, args, context, info) => {
    const { currentUser, req } = context;
    const { uuid } = args;
    let listings;

    try {
      listings = await Listing.findByAgentID(uuid);
    } catch (err) {
      logger.log('error', JSON.stringify(err));
      throw err;
    }

    return listings;
  },

  listing: async (obj, args, context, info) => {
    const { uuid: listingID } = args;
    const { currentUser, req } = context;
    let listing;
    console.log('This Listing ID', listingID);
    /*
    if (!currentUser) throwUnautorizedAccessError(req, info);

    if (
      currentUser.role !== superAdmin &&
      currentUser.role !== admin &&
      currentUser.role !== agent
    ) {
      throwUnautorizedAccessError(req, info);
    }
    */

    try {
      listing = await Listing.findByListingID(listingID);
    } catch (err) {
      logger.log('error', JSON.stringify(err));
      throw err;
    }

    if (!listing) return null;

    /*
     * We need to make it public, THANKS!!
    if (currentUser.role === agent && currentUser.uuid !== listing.agentID) {
      throwUnautorizedAccessError(req, info);
    }
    */

    return listing;

    // throwUnautorizedAccessError(req, info);
  },

  listingWithAgent: async (obj, args, context, info) => {
    const { uuid: listingID } = args;
    let listing, agent;

    try {
      listing = await Listing.findByListingID(listingID);
      agent = await User.findByUUID(listing.agentID);
    } catch (err) {
      logger.log('error', JSON.stringify(err));
      throw err;
    }

    return { listing, agent };
  },

  featuredListing: async (obj, args, context, info) => {
    let listing;

    try {
      listing = await Listing.find({featured: true});
    } catch (err) {
      logger.log('error', JSON.stringify(err));
      throw err;
    }

    return listing
  }
};

// const Invoice = require('../../../../models/Invoice');
// const { logger } = require('../../../../utils/logger');
// const { superAdmin, admin, agent } = require('../../../../constants/userTypes');
// const throwUnautorizedAccessError = require('../../../../utils/throwUnauthorizedError');

// module.exports = {
//   allInvoices: async (obj, args, context, info) => {
//     const { currentUser, req } = context;
//     let invoices;

//     if (!currentUser) throwUnautorizedAccessError(req, info);

//     if (currentUser.role !== superAdmin && currentUser.role !== admin) {
//       throwUnautorizedAccessError(req, info);
//     }

//     try {
//       invoices = await Invoice.find({}).exec();
//     } catch (err) {
//       logger.log('error', JSON.stringify(err));
//       throw err;
//     }

//     return invoices;
//   },
//   allInvoicesByDateRange: async (obj, args, context, info) => {
//     const { currentUser, req } = context;
//     const { startDate, endDate } = args;
//     let invoices;

//     if (!currentUser) throwUnautorizedAccessError(req, info);

//     if (currentUser.role !== superAdmin && currentUser.role !== admin) {
//       throwUnautorizedAccessError(req, info);
//     }

//     try {
//       invoices = await Invoice.findByDateRange(startDate, endDate);
//     } catch (err) {
//       logger.log('error', JSON.stringify(err));
//       throw err;
//     }

//     return invoices;
//   },
//   allInvoicesByAgentName: async (obj, args, context, info) => {
//     const { currentUser, req } = context;
//     const { agentName } = args;
//     let invoices;

//     if (!currentUser) throwUnautorizedAccessError(req, info);

//     if (currentUser.role !== superAdmin && currentUser.role !== admin) {
//       throwUnautorizedAccessError(req, info);
//     }

//     try {
//       invoices = await Invoice.findByAgentName(agentName);
//     } catch (err) {
//       logger.log('error', JSON.stringify(err));
//       throw err;
//     }

//     return invoices;
//   },
//   invoicesByAgentID: async (obj, args, context, info) => {
//     const { currentUser, req } = context;
//     const { uuid } = args;
//     let invoices;

//     if (!currentUser) throwUnautorizedAccessError(req, info);

//     if (
//       currentUser.role !== superAdmin &&
//       currentUser.role !== admin &&
//       currentUser.role !== agent
//     ) {
//       throwUnautorizedAccessError(req, info);
//     }

//     if (currentUser.role === agent && currentUser.uuid !== uuid) {
//       throwUnautorizedAccessError(req, info);
//     }

//     try {
//       invoices = await Invoice.findByAgentID(uuid);
//     } catch (err) {
//       logger.log('error', JSON.stringify(err));
//       throw err;
//     }

//     return invoices;
//   },
//   invoicesByAgentRealEstateLicenseNumber: async (obj, args, context, info) => {
//     const { currentUser, req } = context;
//     const { agentRealEstateLicenseNumber } = args;
//     let invoices;

//     if (!currentUser) throwUnautorizedAccessError(req, info);

//     if (
//       currentUser.role !== superAdmin &&
//       currentUser.role !== admin &&
//       currentUser.role !== agent
//     ) {
//       throwUnautorizedAccessError(req, info);
//     }

//     if (
//       currentUser.role === agent &&
//       currentUser.agent.agentRealEstateLicenseNumber !==
//         agentRealEstateLicenseNumber
//     ) {
//       throwUnautorizedAccessError(req, info);
//     }

//     try {
//       invoices = await Invoice.findByAgentRealEstateLicenseNumber(
//         agentRealEstateLicenseNumber
//       );
//     } catch (err) {
//       logger.log('error', JSON.stringify(err));
//       throw err;
//     }

//     return invoices;
//   },
//   invoice: async (obj, args, context, info) => {
//     const { uuid: invoiceID } = args;
//     const { currentUser, req } = context;
//     let invoice;

//     if (!currentUser) throwUnautorizedAccessError(req, info);

//     if (
//       currentUser.role !== superAdmin &&
//       currentUser.role !== admin &&
//       currentUser.role !== agent
//     ) {
//       throwUnautorizedAccessError(req, info);
//     }

//     try {
//       invoice = await Invoice.findByInvoiceID(invoiceID);
//     } catch (err) {
//       logger.log('error', JSON.stringify(err));
//       throw err;
//     }

//     if (!invoice) return null;

//     if (currentUser.role === agent && currentUser.uuid !== invoice.agentID) {
//       throwUnautorizedAccessError(req, info);
//     }

//     return invoice;

//     // throwUnautorizedAccessError(req, info);
//   },
// };
