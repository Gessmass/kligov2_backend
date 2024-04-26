import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {NewOrganizationInput, Organization} from "../entities/organization";

@Resolver(Organization)
export class OrganizationResolver {
	@Query(() => [Organization])
	async getAllOrganizations() {
		return await Organization.find()
	}

	@Mutation(() => Organization)
	async createNewOrganization(@Arg("data") newOrganizationData: NewOrganizationInput) {
		console.log("new orga data", newOrganizationData)
		const resultsFromSave = await Organization.save({...newOrganizationData})
		const saveResult = await Organization.find({
			where: {id: resultsFromSave.id}
		})

		return saveResult[0]
	}
}

