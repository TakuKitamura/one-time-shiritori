migrate-dev-network:
	truffle migrate --network development
clean:
	rm -rf client/src/contracts
clean-deploy-to-dev: clean migrate-dev-network
test:
	truffle test